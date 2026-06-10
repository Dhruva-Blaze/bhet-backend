const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('http://localhost:5000/api/products/admin/6a1083f23e8aa8729e78146d'); // wait, I don't know the product ID of 'Test'.
  } catch(e) { console.error(e.message); }
}
run();
