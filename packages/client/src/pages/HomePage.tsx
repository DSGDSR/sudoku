import { useEffect, useState } from 'react';
import Button, { ButtonSizes } from '../components/Button';
import { GameType } from '../interfaces/game.enum';
import AgainstTheClock from './AgainstTheClock';
import IndividualGame from './IndividualGame';
import VersusGame from './VersusGame';

import './styles/HomePage.css';

const HomePage = ({
  socket,
  urlParams,
}: {
  socket: any;
  urlParams: URLSearchParams;
}) => {
  const [gameType, setGameType] = useState<GameType>(GameType.None);

  useEffect(() => {
    const r = urlParams?.get('r');
    if (r) {
      setGameType(GameType.Multiplayer);
    }
  }, [urlParams]);

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

            <div className="margin-top-large displayflex">
              <Button size={ButtonSizes.Medium} text="Settings" />
              <Button
                size={ButtonSizes.Medium}
                text="Share"
                className="margin-left-small"
                style={{ padding: '13px 13px 11px 13px', marginTop: '2px' }}
              />
            </div>
          </>
        )}
        {gameType === GameType.Individual && (
          <IndividualGame back={() => setGameType(GameType.None)} />
        )}
        {gameType === GameType.AgainstTheClock && (
          <AgainstTheClock back={() => setGameType(GameType.None)} />
        )}
        {gameType === GameType.Multiplayer && (
          <VersusGame
            socket={socket}
            back={() => setGameType(GameType.None)}
            urlParams={urlParams}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;
