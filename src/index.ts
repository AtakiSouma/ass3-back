import app from "./server";
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening on port ${port} `);
});
