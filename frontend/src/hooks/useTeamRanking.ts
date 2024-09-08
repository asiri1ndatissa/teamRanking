import { useState, useEffect } from 'react';
import { ITeamRank } from '../utils/interfaces/teamRank.interface';

const useTeamRanks = () => {
  const [teamRanks, setTeamRanks] = useState<ITeamRank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTeamRanks = async () => {
      try {
        const response = await fetch('http://localhost:4001/getSeasonRanks');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ITeamRank[] = await response.json();
        setTeamRanks(data);
      } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamRanks();
  }, []);

  return { teamRanks, loading };
};

export default useTeamRanks;