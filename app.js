const expres = require("express");
const cors = require("cors");
const mysql = require("mysql");
const puerto = process.env.PUERTO || 3000;

let app = expres();

app.use(expres.json());

app.use(cors());

//Connection DB
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sql/Server*32",
  database: "prodcutregistrationdb",
});

connection.connect((error) => {
  if (error) {
    throw error;
  } else {
    console.log("Successful Connection");
  }
});

app.get("/", (req, res) => {
  res.send("Ruta de inicio");
});

app.listen(puerto, () => {
  console.log(`Server ok, puerto: ${puerto}`);
});

// Query products
app.get("/api/products", (req, res) => {
  connection.query("SELECT * FROM products", (error, rows) => {
    if (error) {
      throw error;
    } else {
      res.send(rows);
    }
  });
});

//Query product
app.get("/api/products/:id", (req, res) => {
  connection.query(
    "SELECT * FROM products WHERE ID = ?",
    [req.params.id],
    (error, row) => {
      if (error) {
        throw error;
      } else {
        res.send(row);
        // res.send(row[0].nameProduct);
      }
    }
  );
});

// Create product
app.post("/api/products", (req, res) => {
  let data = {
    nameProduct: req.body.nameProduct,
    price: req.body.price,
    stock: req.body.stock,
  };

  let sql = "INSERT INTO products SET ? ";

  connection.query(sql, data, (error, result) => {
    if (error) {
      throw error;
    } else {
      // res.send(result);
      Object.assign(data, {id: result.insertId})
      res.send(data)
    }
  });
});

//Update prodcut
app.put("/api/products/:id", (req, res) => {
  let id = req.params.id;
  let nameProduct = req.body.nameProduct;
  let price = req.body.price;
  let stock = req.body.stock;
  let sql =
    "UPDATE products SET nameProduct = ?, price = ?, stock = ? WHERE id = ? ";

  connection.query(sql, [nameProduct, price, stock, id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.send(results);
    }
  });
});

//Delete product
app.delete("/api/products/:id", (req, res) => {
  connection.query(
    "DELETE FROM products WHERE id = ?",
    [req.params.id],
    (error, rows) => {
      if (error) {
        throw error;
      } else {
        res.send(rows);
      }
    }
  );
});
