fetch('http://localhost:3000/removeManga', {
    method: "POST",
    body: JSON.stringify({
        "url": "https://mangasee123.com/manga/Ijiranaide-Nagatoro-san",
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    // "title": { "main": "Don't Toy With Me, Miss Nagatoro", "alt": "Ijiranaide Nagatoro-san" },
    // "authors": ["774 house"], "genres": ["Comedy", "Romance", "School Life", "Shounen"],
    // "summary": "Nagatoro is a freshman girl in high school who loves bullying her Senpai. But he puts up with it, even after being put through all kinds of embarrassing situations, because he's in love with her.",
    // "type": "manga",
    // "status": { "scan": "ongoing", "publish": "ongoing" },
    // "coverImage": "https://temp.compsci88.com/cover/Ijiranaide-Nagatoro-san.jpg",