// Step 4: Create an Express server using TypeScript
import express from 'express';
import path from 'path';
import cors  from 'cors';

import { updatedRanking } from './Route/SeasonRank/getSeasonRank';



const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's origin
}));

// app.use(express.static(path.join(__dirname, '../public')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'index.html'));
// });

// New route to get season ranks
app.get('/getSeasonRanks', (req, res) => {
  const seasonRanks = updatedRanking();
  res.json(seasonRanks);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});