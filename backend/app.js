import fs from 'node:fs/promises';
import path from 'node:path'; // 1. Added path module to resolve files accurately
import process from 'node:process'; // Added for environment variables

import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(bodyParser.json());
app.use('/api', express.static('public'));

// 2. Moved OPTIONS check to the top of your CORS headers middleware.
// This prevents browsers from getting 404 errors during preflight requests.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/api/meals', async (req, res) => {
  try {
    // 3. Use absolute paths based on the current working directory (process.cwd())
    // Cloud platforms like Render or Vercel alter file structures; this keeps paths exact.
    const filePath = path.join(process.cwd(), 'data', 'available-meals.json');
    const meals = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(meals));
  } catch (error) {
    console.error("Error reading meals:", error);
    res.status(500).json({ message: 'Failed to fetch meals from the database.' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body.order;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: 'Missing data.' });
    }

    if (
      !orderData.customer?.email ||
      !orderData.customer.email.includes('@') ||
      !orderData.customer.name?.trim() ||
      !orderData.customer.street?.trim() ||
      !orderData.customer['postal-code']?.trim() ||
      !orderData.customer.city?.trim()
    ) {
      return res.status(400).json({
        message: 'Missing data: Email, name, street, postal code or city is missing.',
      });
    }

    const newOrder = {
      ...orderData,
      id: (Math.random() * 1000).toString(),
    };

    const filePath = path.join(process.cwd(), 'data', 'orders.json');
    
    // Safety fallback: if orders.json doesn't exist, start with an empty array
    let allOrders = [];
    try {
      const orders = await fs.readFile(filePath, 'utf8');
      allOrders = JSON.parse(orders);
    } catch (e) {
      allOrders = [];
    }

    allOrders.push(newOrder);
    await fs.writeFile(filePath, JSON.stringify(allOrders, null, 2));
    res.status(201).json({ message: 'Order created!' });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: 'Failed to process order.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// 4. Change hardcoded 3000 to dynamically use your hosting platform's allocated port.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// import fs from 'node:fs/promises';

// import bodyParser from 'body-parser';
// import express from 'express';

// const app = express();

// app.use(bodyParser.json());
// app.use('/api', express.static('public'));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// app.get('/api/meals', async (req, res) => {
//   const meals = await fs.readFile('./data/available-meals.json', 'utf8');
//   res.json(JSON.parse(meals));
// });

// app.post('/api/orders', async (req, res) => {
//   const orderData = req.body.order;

//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   if (orderData === null || orderData.items === null || orderData.items.length === 0) {
//     return res
//       .status(400)
//       .json({ message: 'Missing data.' });
//   }

//   if (
//     orderData.customer.email === null ||
//     !orderData.customer.email.includes('@') ||
//     orderData.customer.name === null ||
//     orderData.customer.name.trim() === '' ||
//     orderData.customer.street === null ||
//     orderData.customer.street.trim() === '' ||
//     orderData.customer['postal-code'] === null ||
//     orderData.customer['postal-code'].trim() === '' ||
//     orderData.customer.city === null ||
//     orderData.customer.city.trim() === ''
//   ) {
//     return res.status(400).json({
//       message:
//         'Missing data: Email, name, street, postal code or city is missing.',
//     });
//   }

//   const newOrder = {
//     ...orderData,
//     id: (Math.random() * 1000).toString(),
//   };
//   const orders = await fs.readFile('./data/orders.json', 'utf8');
//   const allOrders = JSON.parse(orders);
//   allOrders.push(newOrder);
//   await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));
//   res.status(201).json({ message: 'Order created!' });
// });

// app.use((req, res) => {
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }

//   res.status(404).json({ message: 'Not found' });
// });

// app.listen(3000);


