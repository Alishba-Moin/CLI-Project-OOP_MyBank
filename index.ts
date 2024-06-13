#! usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

// bank account interface
interface IBankAccount {
    accountNumber : number,
    balance : number,
    credit(amount : number): void;
    debit(amount :number): void;
    checkBalance(): void;
}
// bank account class 
class BankAccount implements IBankAccount {
    accountNumber: number;
    balance: number;

    constructor(accountNumber : number, balance : number){
        this.accountNumber = accountNumber,
        this.balance = balance
    }
    credit(amount: number): void {
        if(amount > 0){
            amount -= 1
            this.balance += amount
            console.log(chalk.green(`Deposit Of $${amount} Successfully . Remaning Balance : $${this.balance}`));
        }    
    }
    debit(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount
            console.log(chalk.green(`Withdrwal Of $${amount} Successfully . Reamaining Balance : $${this.balance}`));
        } else {
            console.log(chalk.red("Insufficient Balance"));       
        }
    }
  
    checkBalance(): void {
        console.log(chalk.green(`Current Balance : $${this.balance}`));
    } 
}
// customer class
class Customer {
    firstName : string;
    lastName : string;
    gender : string;
    age : number;
    mobileNumber : number;
    account : BankAccount

    constructor(firstName : string,lastName : string,gender : string,age : number, mobileNumber : number,account : BankAccount){
        this.firstName = firstName,
        this.lastName = lastName,
        this.gender = gender,
        this.age = age,
        this.mobileNumber = mobileNumber,
        this.account = account
    }
}
// accounts details
const accounts : BankAccount[] = [
    new BankAccount (10001 , 1000),
    new BankAccount (10002 , 1500),
    new BankAccount (10003 , 2000)
]
// customers details
const customers : Customer[] = [
    new Customer ("Alishba","Moin","Female",18, 3134567232 , accounts[0]),
    new Customer ("Daniyal","Ahmed","Male", 21, 3444567232 , accounts[1]),
    new Customer ("Zimal","Fatima","Female", 23, 3004567232 , accounts[2]),
]
// function
async function bankService(){
    while (true) {

        const accountNumberInput = await inquirer.prompt(
            {
            name : "accountNumber",
            type : "input",
            message : chalk.italic("Enter Your Account Number")
           }
        )
        const accountnumber = accountNumberInput.accountNumber
        const customer = customers.find(customer => customer.account.accountNumber.toString() === accountnumber)
        
        if(customer){
            console.log(chalk.greenBright.italic.underline(`Welcome ${customer.firstName} ${customer.lastName}!\n`));

        const ans = await inquirer.prompt(
            {
             name :"select",
             type : "list",
             message : "select An Operation",
             choices : ["Deposit","WithDraw","Check Balance","Update Details","Exit"]
            }
        )
        switch (ans.select) {
            case "Deposit":
                const depositAmount = await inquirer.prompt({
                    name : "amount",
                    type : "number",
                    message : chalk.italic("Enter The Amount To Deposit: "),
                    validate : input => isNaN(input) || Number(input) <= 0 ? "Enter A Valid Number" : true
             })
                customer.account.credit(depositAmount.amount)
                break;
            case "WithDraw":
                    const withdrawAmount = await inquirer.prompt({
                        name : "amount",
                        type : "number",
                        message : chalk.italic("Enter the amount to withDraw: "),
                        validate : input => isNaN(input) || Number(input) <= 0 ? "Enter A Valid Number" : true
                    })
                    customer.account.debit(withdrawAmount.amount)  
                break;      
            case "Check Balance":
                    customer.account.checkBalance()
                break; 
            case "Update Details":
                const UpdateDetails = await inquirer.prompt([
                {
                    name : "firstName",
                    type : "input",
                    message : "Enter Your First Name",
                    default : chalk.yellowBright(customer.firstName)
                 },
                {
                    name : "lastName",
                    type : "input",
                    message : "Enter Your Last Name",
                    default : chalk.yellowBright(customer.lastName)
                },
                {
                    name : "gender",
                    type : "list",
                    message : "Select Your Gender",
                    choices : ["Male", "Female","Other"],
                    default : chalk.yellowBright(customer.gender)
                },
                {
                    name : "age",
                    type : "input",
                    message : "Enter Your Age:",
                    default : chalk.yellowBright(customer.age),
                    validate : input => isNaN(input) || Number(input) <= 0 ? "Please Enter A Valid Age" : true
                },
                {
                    name : "mobileNumber",
                    type : "input",
                    message : "Enter Your Mobile Number",
                    default : chalk.yellowBright(customer.mobileNumber),
                    validate : input => isNaN(input) || input.length !== 10 ? "Please Enter A Valid Mobile Number" : true
                }
            ]);
            customer.firstName = UpdateDetails.firstName, 
            customer.lastName = UpdateDetails.lastName,
            customer.gender = UpdateDetails.gender,
            customer.age = Number(UpdateDetails.age),
            customer.mobileNumber = Number(UpdateDetails.mobileNumber)    
            console.log(chalk.bold.yellowBright(`Customer Details Update Successfully!`));
            break;
            case "Exit":
                console.log("Exit the program....")   
                console.log(chalk.italic.red(`\n Thank You For Using Our Bank Service.Have A Great Day!`));
                  return;   
        }
        }else{
            console.log(chalk.red(`Invalid Account Number.Please Try Again`));
        }
    } 
}  
bankService();

