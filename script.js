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

const displayMovements = function(movements, sort = false){
containerMovements.innerHTML = ""
const movs = sort? movements.slice().sort((a,b) => a-b): movements;
movs.forEach(function(value, index, arr){


const type = value > 0? "deposit" : "withdrawal"

  const html= `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${index+1} ${type}</div>
  <div class="movements__value">${value}€</div>
</div>`;

containerMovements.insertAdjacentHTML("afterbegin", html)

})
};

const createUsernames = function(accs){

  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase().split(" ").map(name => name[0]).join("");
  })
};

createUsernames(accounts)

const calcDisplayBalance = function(movements){
  const balance = movements.reduce(function(acc, mov){
   return acc+ mov
  },0)
  labelBalance.textContent = `${balance}€`
  return balance

}


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, 650, -130, 70, 1300];
const withdrawals = movements.filter(mov => mov < 0);


const calcDisplaySummary = function(acc){
const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov)=> acc + mov, 0);

const out = acc.movements.filter(mov => mov<0).reduce((acc, mov) => acc + mov, 0);

const interest = acc.movements.filter(mov => mov > 0).map((mov)=> mov * (acc.interestRate/100)).filter(mov => mov >=1).reduce((acc, mov) => acc + mov, 0);

labelSumIn.textContent = `${incomes}€`;
labelSumOut.textContent = `${Math.abs(out)}€`;
labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function(acc){
//Display Movements
displayMovements(acc.movements);
//Display balance
calcDisplayBalance(acc.movements);
//Display Summary
calcDisplaySummary(acc);
}


let currentAccount;
btnLogin.addEventListener("click", function(e){
  e.preventDefault();
 currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

 if (currentAccount?.pin === Number(inputLoginPin.value)){
  //Display UI and message
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`
  containerApp.style.opacity = 100;
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
  //update UI
  updateUI(currentAccount);
 };
});

btnTransfer.addEventListener("click", function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
 const currentBalance = calcDisplayBalance(currentAccount.movements);

 if(amount >0 && currentBalance >= amount && currentAccount.username !== receiverAcc?.username && receiverAcc){
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);
  updateUI(currentAccount);
 }

  inputTransferAmount.value = inputTransferTo.value = "";

});

btnLoan.addEventListener("click", function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const userDeposits = currentAccount.movements.some(mov => mov >= amount * 0.1)

  if(amount > 0 && userDeposits){
    //Add movement;
currentAccount.movements.push(amount);
// update UI
updateUI(currentAccount);
inputLoanAmount.value = "";
  }
})

btnClose.addEventListener("click", function(e){
  e.preventDefault();
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin ===  Number(inputClosePin.value)){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;

btnSort.addEventListener("click", function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////