const bcrypt = require("bcryptjs")

module.exports = [

{
_id:"680000000000000000000001",
slug:"admin",
login:"admin",
password:bcrypt.hashSync("admin123",10),
role:"admin",
email:"admin@example.com",
birth_year:1995,
avatar:"https://www.superherodb.com/pictures2/portraits/10/050/27492.jpg?v=1739841912",
favorite_characters:["650000000000000000000001"],
createdAt:"2020-01-01T00:00:00Z",
updatedAt:"2020-01-01T00:00:00Z"
},

{
_id:"680000000000000000000002",
slug:"frierenfan",
login:"frierenFan",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"frieren@anime.pl",
birth_year:2001,
avatar:"https://media.craiyon.com/2025-08-01/tx-9NZm-Q3eCY1lhpXuZkg.webp",
favorite_characters:["650000000000000000000002"],
createdAt:"2023-01-01T00:00:00Z",
updatedAt:"2023-01-01T00:00:00Z"
},

{
_id:"680000000000000000000003",
slug:"meguminlover",
login:"meguminPL",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"megumin@anime.pl",
birth_year:2002,
avatar:"https://example.com/avatar.jpg",
description:"Something about me",
favorite_characters:["650000000000000000000003"],
createdAt:"2020-01-01T00:00:00Z",
updatedAt:"2020-01-01T00:00:00Z"
},

{
_id:"680000000000000000000004",
slug:"erenjaeger",
login:"erenJ",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"eren@anime.pl",
birth_year:1999,
avatar:"https://example.com/avatar.jpg",
description:"Something about me",
favorite_characters:["650000000000000000000004"],
createdAt:"2015-01-01T00:00:00Z",
updatedAt:"2015-01-01T00:00:00Z"
},

{
_id:"680000000000000000000005",
slug:"narutofan",
login:"dattebayo",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"naruto@anime.pl",
birth_year:2000,
avatar:"https://example.com/avatar.jpg",
description:"Something about me",
favorite_characters:["650000000000000000000005"],
createdAt:"2010-01-01T00:00:00Z",
updatedAt:"2010-01-01T00:00:00Z"
},

{
_id:"680000000000000000000006",
slug:"pirateking",
login:"luffyFan",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"luffy@anime.pl",
birth_year:1998,
avatar:"https://example.com/avatar.jpg",
description:"Something about me",
favorite_characters:["650000000000000000000006"],
createdAt:"2010-01-01T00:00:00Z",
updatedAt:"2010-01-01T00:00:00Z"
},

{
_id:"680000000000000000000007",
slug:"kirajustice",
login:"kira",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"light@anime.pl",
birth_year:1997,
avatar:"https://example.com/avatar.jpg",
description:"Something about me",
favorite_characters:["650000000000000000000007"],
createdAt:"2010-01-01T00:00:00Z",
updatedAt:"2010-01-01T00:00:00Z"
},

{
_id:"680000000000000000000008",
slug:"alchemist",
login:"edwardE",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"edward@anime.pl",
birth_year:1996,
avatar:"https://example.com/avatar.jpg",
description:"Something about me",
favorite_characters:["650000000000000000000008"],
createdAt:"2010-01-01T00:00:00Z",
updatedAt:"2010-01-01T00:00:00Z"
},

{
_id:"680000000000000000000009",
slug:"jujutsuuser",
login:"itadori",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"yuji@anime.pl",
birth_year:2003,
avatar:"https://example.com/avatar.jpg",
description:"Something about me",
favorite_characters:["650000000000000000000009"],
createdAt:"2020-01-01T00:00:00Z",
updatedAt:"2020-01-01T00:00:00Z"
},

{
_id:"680000000000000000000010",
slug:"demonslayer",
login:"tanjiro",
password:bcrypt.hashSync("test123",10),
role:"user",
email:"tanjiro@anime.pl",
birth_year:2004,
avatar:"https://example.com/avatar.jpg",
description:"Something about me",
favorite_characters:["650000000000000000000010"],
createdAt:"2020-01-01T00:00:00Z",
updatedAt:"2020-01-01T00:00:00Z"
}

]