let checkPermission = async function(msg, permissionFlag) {
    let author = msg.author;
    let guild = msg.guild;
    let guildAuthor = await guild.members.fetch(author);
    return guildAuthor.hasPermission(permissionFlag);
}

module.exports = {
    checkPermission
}