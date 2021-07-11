const http = require('http').createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(rooms));
    res.end();
});
const io = require('socket.io')(http, { cors: { origin: "*" } });
const { makeid } = require('./utils');

const roomCodeLength = 8;
const numberOfWords = 25;
const wordList = require('./data/wordlist.json');;
const rooms = {};
const teamNames = {
    red: "Rose",
    blue: "Indigo"
}

io.on('connection', (socket) => {

    console.log(`✅ ${socket.id} connected`);

    socket.on('createRoom', (args) => {
        let roomCode = makeid(roomCodeLength);
        rooms[roomCode] = {
            code: roomCode,
            loading: false,
            startedAt: Date.now(),
            gameover: false,
            board: [],
            players: [
                {
                    id: socket.id,
                    name: args.name,
                    team: 'spectator',
                    spymaster: false
                }
            ]
        };
        initializeGameBoard(roomCode);
        socket.emit('roomCreated', rooms[roomCode]);
        console.log(`✨ New room created: ${roomCode}`);
        socket.join(roomCode);
        sendSystemMessage(roomCode, 'Room created! Have fun! 😉', 'star');
        console.log(`➕ ${args.name} joined room ${args.roomCode}`);
    });

    socket.on('joinRoom', (args) => {
        const room = io.sockets.adapter.rooms.get(args.roomCode);
        
        if(room == undefined || room.size === 0) {
            socket.emit('unknownCode');
            return;
        }

        if(room.size >= 4) {
            socket.emit('tooManyPlayers');
            return;
        }

        if(room.has(socket.id)) {
            socket.emit('alreadyInRoom');
            return;
        }
        
        rooms[args.roomCode].players.push({
            id: socket.id,
            name: args.name,
            team: 'spectator',
            spymaster: false
        });

        socket.emit('roomJoined', rooms[args.roomCode]);
        io.in(args.roomCode).emit('playersChange');
        socket.join(args.roomCode);
        updateRoomState(args.roomCode);
        sendSystemMessage(args.roomCode, `<strong class="text-team-spectator">${args.name}</strong> joined the room`, 'plus');
        console.log(`➕ ${args.name} joined the room ${args.roomCode}`);
    });

    socket.on('leaveRoom', (args) => {
        cleanRoom(socket.id, args.roomCode);
        socket.leave(args.roomCode);
        updateRoomState(args.roomCode);
        console.log(`➖ ${args.name} left the room ${args.roomCode}`);
    });

    socket.on('disconnect', (reason) => {
        cleanRoom(socket.id);
        console.log(`⛔ ${socket.id} disconnected`);
    });

    function updateRoomState(roomCode) {
        io.in(roomCode).emit('stateUpdate', rooms[roomCode]);
    }

    function sendSystemMessage(roomCode, content, icon) {
        io.in(roomCode).emit('chatMessage', {
            systemMessage: true,
            time: new Date(),
            content: content,
            icon: icon || 'chevron-right'
        });
    }

    function sendGameFireworks(roomCode, team) {
        io.in(roomCode).emit('gameFireworks', {
            team: team
        });
    }
    function cleanRoom(playerID, roomCode = null) {
        function removePlayerFromRoom(playerID, roomCode) {
            if(rooms[roomCode]) {
                // Remove player from room
                rooms[roomCode].players = rooms[roomCode].players.filter(function(player) {
                    if(player.id === playerID) {
                        io.in(roomCode).emit('playersChange');
                        sendSystemMessage(roomCode, `<strong class="text-team-${player.team}">${player.name}</strong> left the room`, 'minus');
                    }
                    return player.id !== playerID;
                });
                // If room is empty remove it
                if(rooms[roomCode].players.length === 0) {
                    delete rooms[roomCode];
                }
            }
        }

        if(roomCode != null && roomCode.length === roomCodeLength) {
            removePlayerFromRoom(playerID, roomCode);
        } else {
            for (let room in rooms) {
                removePlayerFromRoom(playerID, room);
                updateRoomState(room);
            }
        }
    }

    function initializeGameBoard(roomCode) {
        let wordIndexes = [...Array(wordList.length).keys()];
        wordIndexes = wordIndexes.sort(() => Math.random() - 0.5).slice(0, numberOfWords);

        // Create board from the word list
        rooms[roomCode].board = [];
        rooms[roomCode].gameover = false;
        for (let index = 0; index < numberOfWords; index++) {
            rooms[roomCode].board.push({
                id: index,
                word: wordList[wordIndexes[index]],
                type: 'neutral',
                flipped: false
            });
        }

        // Decide who goes first and how much bomb cards are there
        let cardCounts = [8, 9].sort(() => Math.random() - 0.5);
        const redWordsCount = cardCounts[0];
        const blueWordsCount = cardCounts[1];
        const bombWordsCount = 1;

        // Randomize cards types
        let randomWordOrder = [...Array(numberOfWords).keys()].sort(() => Math.random() - 0.5);
        for (let index = 0; index < (redWordsCount + blueWordsCount + bombWordsCount); index++) {
            let type;
            if(index < redWordsCount) {
                type = 'red';
            } else if((index - redWordsCount) < blueWordsCount) {
                type = 'blue';
            } else {
                type = 'bomb';
            }
            rooms[roomCode].board[randomWordOrder[index]].type = type;
        }
        
        rooms[roomCode].loading = false;
    }

    function checkEndConditions(roomCode, lastCard, lastPlayer) {
        // Bomb card flipped
        if(lastCard.type === 'bomb') {
            const winningTeam = lastPlayer.team == 'red' ? 'blue' : 'red';
            sendSystemMessage(roomCode, `<strong class="text-team-${winningTeam}">${teamNames[winningTeam]} Team</strong> won!`, 'crown');
            sendGameFireworks(roomCode, winningTeam);
            rooms[roomCode].gameover = true;
        }

        // All team cards flipped
        function allCardsFlipped(team) {
            const cards = rooms[roomCode].board.filter((card) => card.type === team);
            if(cards.length === cards.filter((card) => card.flipped).length) {
                sendSystemMessage(roomCode, `<strong class="text-team-${team}">${teamNames[team]} Team</strong> won!`, 'crown');
                sendGameFireworks(roomCode, team);
                rooms[roomCode].gameover = true;
            }
        }
        allCardsFlipped('red');
        allCardsFlipped('blue');
    }

    socket.on('joinTeam', (args) => {
        const player = rooms[args.roomCode].players.find((player) => player.id == args.player.id);
        
        if(player) {
            player.team = args.team;
            player.spymaster = false;
            updateRoomState(args.roomCode);
            io.in(args.roomCode).emit('playersChange');
            console.log(`🏴 ${args.player.name} joined team ${args.team} in room ${args.roomCode}`);
        }
    });

    socket.on('setSpymaster', (args) => {
        const player = rooms[args.roomCode].players.find((player) => player.id == args.player.id);
        
        if(player) {
            player.spymaster = args.spymaster;
            updateRoomState(args.roomCode);
            io.in(args.roomCode).emit('playersChange');
            console.log(`🔍 ${args.player.name} become ${args.spymaster ? 'spymaster' : 'operative'} in room ${args.roomCode}`);
        }
    });
    
    socket.on('chatMessage', (args) => {
        io.in(args.roomCode).emit('chatMessage', {
            time: new Date(),
            sender: args.sender,
            content: args.content
        })
    });

    socket.on('flipBoard', (args) => {
        rooms[args.roomCode].board.map((card) => card.flipped = false);
        rooms[args.roomCode].loading = true;
        updateRoomState(args.roomCode);
    });

    socket.on('emptyBoard', (args) => {
        rooms[args.roomCode].board = [];
        updateRoomState(args.roomCode);
    });

    socket.on('newGameBoard', (args) => {
        initializeGameBoard(args.roomCode);
        updateRoomState(args.roomCode);
        sendSystemMessage(args.roomCode, `New game board generated`, 'sync');
    });

    socket.on('cardFlipped', (args) => {
        rooms[args.roomCode].board[args.card.id].flipped = true;
        sendSystemMessage(args.roomCode, `<strong class="text-team-${args.player.team}">${args.player.name}</strong> flipped <strong class="text-card-${args.card.type} uppercase">${args.card.word}</strong>`, 'clone');
        if(!rooms[args.roomCode].gameover) {
            checkEndConditions(args.roomCode, args.card, args.player);
        }
        updateRoomState(args.roomCode);
    });

});

http.listen(process.enn.PORT || 3000, () => console.log('Listening..'));