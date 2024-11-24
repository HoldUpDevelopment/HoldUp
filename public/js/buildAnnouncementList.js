async function getAnnouncementList(userId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/news/getAnnouncements`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
  }

(async () => {
    var documents = await getAnnouncementList();
    console.log(JSON.stringify(documents));
})()