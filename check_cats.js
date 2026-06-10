const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('http://localhost:5000/api/categories?limit=1000');
    console.log("Keys in res.data:", Object.keys(res.data));
    console.log("Is res.data.data an array?", Array.isArray(res.data.data));
    console.log("Is res.data.categories an array?", Array.isArray(res.data.categories));
  } catch(e) { console.error(e.message); }
}
run();
