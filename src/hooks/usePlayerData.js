import { useState } from 'react';

const usePlayerData = () => {
    const [players, setPlayers] = useState([
        { id: 'player1', position: 'lb', playernumber: 1 },
        { id: 'player2', position: 'lb', playernumber: 1 },
        { id: 'player3', position: 'lb', playernumber: 1 },
        { id: 'player4', position: 'lb', playernumber: 1 },
        { id: 'player5', position: 'lb', playernumber: 1 }
    ]);

    return players;
}

export default usePlayerData;
