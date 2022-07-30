import { useState } from 'react';
import logo from '../../assets/logo.svg';
import Button, { ButtonSizes } from '../components/Button';
import { GameType } from '../interfaces/game.enum';
import AgainstTheClock from './AgainstTheClock';
import IndividualGame from './IndividualGame';

import './styles/HomePage.css';
import VersusGame from './VersusGame';

const HomePage = () => {
  const [gameType, setGameType] = useState<GameType>(GameType.None);

  return (
    <div className="homepage">
      {/*<img className="homepage__logo" src={logo} />*/}

      <main className="homepage__container margin-top-large padding-top-large ">
        {gameType === GameType.None && (
          <>
            <Button
              size={ButtonSizes.Large}
              text="Quick game"
              onClick={() => setGameType(GameType.Individual)}
            />
            <Button
              size={ButtonSizes.Large}
              text="Against the clock"
              onClick={() => setGameType(GameType.AgainstTheClock)}
            />
            <Button
              size={ButtonSizes.Large}
              text="Multiplayer"
              onClick={() => setGameType(GameType.Multiplayer)}
            />
          </>
        )}
        {gameType === GameType.Individual && (
          <IndividualGame back={() => setGameType(GameType.None)} />
        )}
        {gameType === GameType.AgainstTheClock && (
          <AgainstTheClock back={() => setGameType(GameType.None)} />
        )}
        {gameType === GameType.Multiplayer && (
          <VersusGame back={() => setGameType(GameType.Multiplayer)} />
        )}
      </main>
    </div>
  );
};

export default HomePage;
