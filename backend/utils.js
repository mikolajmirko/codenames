// Make an alphanumeric ID with a giver length
// https://github.com/HungryTurtleCode/multiplayerSnake/blob/master/server/utils.js

module.exports = { makeid }
  
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}