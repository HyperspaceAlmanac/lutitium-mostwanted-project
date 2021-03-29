"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = searchByCriteria(people);
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(person.length === 0){
    alert("Could not find that individual.");
    return app(people); // restart
  } else if (person.length > 1) {
    alert("Multiple individuals that match the search criteria");
    displayPeople(person);
    return app(people);
  }
  let singlePerson = person[0];

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
    // TODO: get person's info
      displayPerson(singlePerson);
      break;
    case "family":
    // TODO: get person's family
    break;
    case "descendants":
    // TODO: get person's descendants
      descendantsSearch(singlePerson, people);
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person using the name they entered
  // TODO: Need to figure out how to handle if multiple matches are found
  return foundPerson;
}

function searchByCriteria(people, count = 0){

  let criteria = promptFor("Here are the criteria: height, weight, dob, eyeColor," 
  + "occupation, parents, currentSpouse.  Which one would you like to choose?", checkCriteria);

  //Not quite done here.
  let criteriaValue = promptFor("What ${criteria} value are you looking for?", chars);
  let foundPerson = people.filter(function(person){
    if(person[criteria] == criteriaValue){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person using the name they entered
  // TODO: Need to figure out how to handle if multiple matches are found
  //user input yes or no to stop
  if (foundPerson.length > 1) {
    displayPeople(foundPerson);
  }
  //Prompt user;

  if(foundPerson.length > 1 && count < 5){
    var continueSearching = promptFor("There are " + foundPerson.length + " maches, would you like to continue searching?  yes or no.", chars).toLowerCase();
    if (continueSearching == "yes") {
      foundPerson = searchByCriteria(foundPerson, count + 1);
    }
  }
  return foundPerson;
}

// alerts a list of people
function displayPeople(people){
  var firstPart = "There are " + people.length + " match" + (people.length == 1 ? "" : "es") + " so far:\n";
  firstPart += people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n");
  alert(firstPart);
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Age: " + person.age + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "EyeColor: " + person.eyeColor + "\n";
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}

function checkCriteria(criteria){
  switch(criteria){
    case "gender":
    case "height":
    case "weight":
    case "dob":
    case "eyeColor":
    case "occupation":
    case "parents":
    case "currentSpouse":
      return true;
    default:
      return false;
  }
}
function descendantsSearch(person, people) {
	let result = [];
	recursiveDescendantSearch(person, people, result);
	if (result.length > 0) {
		let fullResult = person.firstName + " " + person.lastName + "'s descendants:\n";
		for (let i = 0; i < result.length; i++) {
			fullResult += result[i].firstName + " " + result[i].lastName + "\n";
		}
		alert(fullResult);
	} else {
		alert("Unable to find " + person.firstName + " " + person.lastName + "'s descendants in database");
	}
}
function recursiveDescendantSearch(person, people, result) {
  let filteredList = people.filter(p => p.parents.includes(person.id));
	for (let i = 0; i < filteredList.length; i++) {
		result.push(filteredList[i]);
		recursiveDescendantSearch(filteredList[i], people, result);
	}
}
