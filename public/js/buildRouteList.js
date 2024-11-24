async function getRouteList(userId) {
    var xmlHttp = new XMLHttpRequest();
    await xmlHttp.open("GET", `${origin}/route/getLiveRoutes`, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
  }

(async () => {
    var documents = await getRouteList();
    console.log(JSON.stringify(documents));
})()