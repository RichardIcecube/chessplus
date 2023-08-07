## Chess+

Chess+ is a collection of various chess games during the course of my Summer Break during 2023. It is developed using the React Chessboard library as well as the chess.js library. For the most part, these libraries do a lot of the heavy lifting regarding the visuals and verifying move logic. 

### Chess

Cut and dry, this is just regular chess. Gotta start with the basics.

### Zombie Chess

The same as regular chess with just one twist: you can take your own pieces. While this is a simple twist, it opens up the game for countless of variations not possible normally. <br /> 

Here are some examples of what's possible: <br />

At the beginning of the game, if for whatever reason, you wanted to castle your king, you could resulting in your king and rook taking your knight and bishop. <br />
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/a759f55f-f861-4739-9a68-8039e96ac2ef)
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/94f955a0-33e3-4cd0-bd0a-8ae58f4e6942) <br />
Clearly, this is not a good move given that you can castle your king for free after you move your pieces out of the way. But, depending on the situation, a sacrifice like this might be exactly what you need to get out of a pinch. <br />
<br />
Have you ever seen this move before? 
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/3c5bf62a-332e-4781-b6a8-f1160a346ed5) <br /> <br />
It prepares for a move known as a fianchetto which primes your opponent's bishop to move into the open space under the advanced pawn giving it a strong sniping outpost aimed right at your rook. This move is tricky to deal with, but in Zombie Chess, you can simply take your own pawn with your bishop to get a clear shot at their rook instead. <br />
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/0ddb9c69-3931-4822-9690-d6f7cf68cedb) <br />
This forces your opponent to either block your bishop with their knight or their pawn to prevent losing material. <br />

Despite being a simple concept, Zombie Chess changes the formula of the classic game just enough to expand on a game that already seems to have countless variations.

### EX Chess

As opposed to the simple twist of Zombie Chess, EX Chess brings a much bigger twist to the table. Inspired by the popular fighting game Street Fighter, EX Chess gives every single piece an EX move that it can use to turn the tide of the game in one swift motion. These EX moves are activated after a player has built up enough meter for the respective piece they want to move. Meter is a gauge at the bottom of the screen that belongs to each player as seen below. <br />

![image](https://github.com/RichardIcecube/chessplus/assets/66053594/c41726c6-89de-40b3-9626-c505cac75d59) <br />

Each player has their own meter and can fill up their meter by moving their own pieces, taking their opponents pieces, or having their pieces taken by their opponent. Higher value pieces such as the Queen, King, and Rook give more meter than minor pieces such as Knights and Bishops which in turn give more meter than Pawns. When a piece is taken, the taker's meter is granted a portion of the amount of meter that piece was worth, and the takee's meter is granted a slightly smaller portion of that meter. <br />

![image](https://github.com/RichardIcecube/chessplus/assets/66053594/3cd83284-11b5-4ce8-a518-bc54285cba38)
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/c0ba4dd9-b790-427e-ada4-adbdefccde34)

### EX Moves
EX moves are the key difference of EX Chess. They allow your pieces a powerful, alternative move that costs meter to use which is activated my clicking on the "Activate EX" button turning it into the "Deactivate EX" button. Each piece has its own EX move and cost per move. <br />

#### EX Pawn - Pawn Break: 1 meter
This move costs 1 meter to perform and allows a Pawn to take an opposing Pawn directly next to it as if the opposing Pawn was one space back. <br />
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/9c513666-83df-4a92-88a2-489dbcc786cb)
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/bf3a897a-bfd7-4f91-abdf-9dd7bbc62430) <br />
This move was inspired by the En Passant: a situational move in standard chess that allows you to take an opposing Pawn in a similar fashion given the correct prerequisities are met. Learn more about the En Passant here: https://en.wikipedia.org/wiki/En_passant.

#### EX Bishop - X-Ray: 2 meter
This move costs 2 meter to perform and allows a Bishop to take an opposing piece regardless of what stands in the way. <br />
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/edfa3614-1307-4790-8233-bd12e800571a)
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/59f84abf-80fb-4447-9b43-cc68ffe01a55) <br />
Some things to note about this move: 
* You cannot take the King with this move
* In order to check the King, you must go to a space behind the King that is either occupied by an opposing piece or not occupied

This move is very strong, but with awareness of your opponent's intentions and foresight, you can avoid disaster by moving your pieces even if they are protected by other pieces.

#### EX Knight - Second Wind: 3 meter
This move costs 3 meter and allows the Knight to move a second time if it takes a piece by moving normally. In the following example, the Knight will use its EX move to take a Pawn which allows it to them move to a space that forks the King and Queen. <br />

![image](https://github.com/RichardIcecube/chessplus/assets/66053594/4aa9bcb3-7b24-4915-abab-982e77f1ce5c) <br />
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/87df0a5f-1b62-4749-b663-a7d9653292ba) <br />
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/9021b7f4-0311-4173-bfbe-f8e295eee952) <br />
This Ex move is absurdly powerful which is the reasoning behind it having a cost of 3 meter. Keep in mind that the Knight is unable to take the King with its follow-up move. <br />

The key to playing around this move is to ensure that the Knight can't take any pieces and that if it can, it can't take anything substantial after that first move. Another strategy of note its to target the Knight early on and trade Bishops for them. <br />

#### EX Rook - King Swap: 3 meter
This move costs 3 meter and allows the Rook to swap positions with the King and is done by dragging the Rook over the King with EX activated. <br />

![image](https://github.com/RichardIcecube/chessplus/assets/66053594/c5a0d5c8-7723-40cc-86c6-e1d40755ae3b)
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/d45fbe49-a4dd-408d-a9e6-f3f496ed84b1) <br />

This move cannot be done when the King is in check.

#### EX Queen - Drone Strike: 4 meter
This move costs 4 meter and allows the Queen to destroy any opposing piece on the board that isn't a King or Queen. <br /> 

![image](https://github.com/RichardIcecube/chessplus/assets/66053594/efb92f06-6a2b-44a2-b72b-aaab9b209a49)
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/6c97ab3a-31d1-490e-8255-7fe45d25da5c) <br />

This move is extremely powerful hence its cost of 4 meter. To deal with this move, it's helpful to give checks to the Queen with minor pieces since the Queen stays stationary for the turn when it uses this move. 

#### EX King - King's Court: 3 meter
This move costs 3 meter and allows the King to teleport to one of the two corners on their side of the board taking any opposing piece occupying that space. <br />

![image](https://github.com/RichardIcecube/chessplus/assets/66053594/068ef8cf-0a1d-4468-b5ea-e29490f945f4)
![image](https://github.com/RichardIcecube/chessplus/assets/66053594/7a8f79ff-17d2-4340-ad5d-545c487f1928)

This move can be done out of check.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
