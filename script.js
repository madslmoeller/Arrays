'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//
// --------------- PRINTING MOVEMENTS ---------------
//
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcAndDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcAndDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display Balance
  calcAndDisplayBalance(acc);

  // Display Summary
  calcAndDisplaySummary(acc);
};

//
// --------------- CREATE USERNAME FOR ACCOUNTS ---------------
//

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//
// --------------- EVENT HANDLERS ---------------
//
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Displays welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Input clear fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    // console.log(index);
  } else {
    console.log('account not found');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// const totalDepInUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepInUSD);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////

// const arr = ['a', 'b', 'c', 'd', 'e'];
// const arr1 = ['f', 'g', 'h', 'i', 'j'];
// console.log(arr);
// console.log(arr1);

// SLICE
// Slicer noget af arrayen af, men muterer ikke (KOPIERER KUN)
// const slicedArr = arr.slice(1, 4);
// console.log(slicedArr);

// SPLICE
// Modsatte af SLICE.
// const splicedArr = arr.splice(3);
// console.log(splicedArr);
// console.log(arr);

// REVERSE
// ['f', 'g', 'h', 'i', 'j'] --> ['j', 'i', 'h', 'g', 'f']
// arr1.reverse();
// console.log(arr1);

// CONCAT
// const concatArr = arr.concat(arr1);
// console.log(concatArr);

// JOIN
// console.log(concatArr.join('/ '));

// PUSH
// arr.push("x");
// console.log(arr);

// UNSHIFT
// arr.unshift("z");
// console.log(arr);

// POP
// arr.pop();
// console.log(arr);

// SHIFT
// arr.shift();
// console.log(arr);

// indexOf
// console.log(arr.indexOf("c"));

// Includes
// console.log(arr.includes("c"));

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i}: You withdrew ${Math.abs(movement)}`);
//   }
// };

// console.log("-----------");

// movements.forEach(function(mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value, key, map) {
//   console.log(`${key}: ${value}`);
// })

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function(value, key, map) {
//   console.log(`${key}: ${value}`);
// })

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// const movementsUsd = movements.map(function(mov) {
//   return Math.trunc(mov * eurToUsd);
// });

// const movementsUsdArrow = movements.map(mov => Math.trunc(mov * eurToUsd));
// console.log(movementsUsdArrow);

// console.log(movements);
// console.log(movementsUsd);

// const movementUsdFor = [];
// for(const mov of movements) movementUsdFor.push(Math.trunc(mov * eurToUsd))
// console.log(movementUsdFor);

// const movementsDesc = movements.map((mov, i) => `Movement ${i}: You ${mov > 0 ? 'deposited' : 'withdrew' } ${Math.abs(mov)}`);
// console.log(movementsDesc);

// const deposits = movements.filter(function(mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(function(mov) {
//   return mov < 0;
// });

// console.log(withdrawals);
// const withdrawals1 = movements.filter(mov => mov < 0);
// console.log(withdrawals1);

// console.log(movements);

// const balance = movements.reduce(function(acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

// console.log(balance);

// //Maximum value
// const maxVal = movements.reduce((acc, mov) => {
//   if (acc > mov)return acc
//   else return mov;
// }, movements[0]);

// console.log(maxVal);

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// console.log(dogsJulia);
// console.log(dogsKate);

// const dogsJuliaCorrected = dogsJulia.slice(1, -2);
// console.log(dogsJuliaCorrected);

// // Coding challenge 1
// const checkDogs = function(arr) {
//   arr.forEach(function(value, i) {
//     if (value >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${value} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   })
// }
// console.log(`----- Julia's dogs -----`);
// checkDogs(dogsJuliaCorrected);
// console.log(`----- Kate's dogs -----`);
// checkDogs(dogsKate);

// Coding challenge 2
// const calcAverageHumanAge = function(ages) {
//   const humanAges = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4);
//   const adultDogs = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adultDogs);
//   const averageAge = adultDogs.reduce((acc, age) => acc + age, 0) / adultDogs.length;

//   return averageAge
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// Coding challenge 3
// const calcAverageHumanAge2 = function(ages) {
//   const humanAges = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4);
//   const adultDogs = humanAges.filter(age => age >= 18);
//   const averageAge = adultDogs.reduce((acc, age, i, arr) => acc + age / arr.length, 0);

//   return averageAge
// };

// const calcAverageHumanAge = ages => ages.map(age => age <= 2 ? 2 * age : 16 + age * 4).filter(age => age >= 18).reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements);
// console.log(movements.includes(-130));
// console.log(movements.includes(-180));
// console.log(movements.includes(3000));

// const anyDeposit = movements.some(mov => mov > 0);
// console.log(anyDeposit);

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// flat
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr);
// console.log(arr.flat());

// const arrDeep = [[1, [2, 3]], [4, [5, 6]], 7, 8];
// console.log(arrDeep);
// console.log(arrDeep.flat(2));

// // map
// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// // flat
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// // reduce
// const overAllBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

//sort
//String
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// // Numbers
// console.log(movements);
// console.log(movements.sort());

// // return < 0 then A, B (keep order)
// // return > 0 then B, A (switch order)

// // ascending
// movements.sort((a, b) => a - b);
// // movements.sort((a, b) => {
// //   if (a > b) return 1;
// //   if (a < b) return -1;
// // });

// console.log(movements);

// // descending
// movements.sort((a, b) => b - a);
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (a < b) return 1;
// // });

// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(arr);
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty Arrays + fill method
// const x = new Array(7);
// console.log(x);

// x.fill(1, 1, 6);
// x.fill(2);
// console.log(x);

// Array.from
// const y = Array.from({ length: 10 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 10 }, (cur, i) => i + 1);
// console.log(z);

// ARRAY METHODS PRACTICE!!!

// 1.
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// 2.
// Løsning 1
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 1000).length;
// Løsning 2
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(numDeposits1000);

// 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
// løsning 1
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
// løsning 2
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// 4.
// this is a nice title ---> This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');

//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

// Coding Challenge #4
// TEST DATA
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Mathilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);

console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6.

const checkEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkEatingOkay));

// 7.
console.log(dogs.filter(checkEatingOkay));

// 8.
const dogsSorted = dogs.sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);

const dogsSorted1 = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted1);

// var a = 10;
// function myFunction() {
//   var a;
//   console.log(a * a);
// }
// myFunction();

// function Animal() {
//   this.name = 'horse';
//   this.walk = function () {
//     console.log('animal can walk');
//   };
// }

// function Man() {
//   Animal.call(this);
//   this.walk = function () {
//     console.log(this.name + ' can walk');
//   };
// }

// Man.prototype = Object.create(Animal.prototype);
// Animal.prototype = Object.create(Animal.prototype);

// var man = new Man();
// var horse = new Animal();
// man.walk();
// horse.walk();

// var n1 = parseInt(Infinity);
// var n2 = parseInt(isNan);
// var n3 = parseInt(null);
// console.log(n1 * n2 * n3);

// var num = 1;
// if (function myFunction() {}) {
//   num += typeof myFunction;
// }
// console.log(num);

// var a = 10 + true + '10';
// alert(a);

// var test = true | false;
// var x = test ? 'expression1' : 'expression2';
// console.log(x);

// for (var x = 0; x < 2; x++) {
//   setTimeout(function () {
//     console.log(x);
//   }, 1);
// }
