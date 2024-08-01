function randomNumberDigits(digits) {
    try {
      if (!Number.isInteger(digits) || digits <= 0) {
        console.error("The number of digits must be a positive integer.");
        return null;
      }
  
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
  
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (error) {
      console.error("Error generating random number:", error.message);
      return null;
    }
};

function randomNumberInRange(min, max) {
    try {
      if (!Number.isInteger(min) || !Number.isInteger(max)) {
        console.error("Both min and max must be integers.");
        return null;
      }
  
      if (min > max) {
        console.error("Min value cannot be greater than max value.");
        return null;
      }
  
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (error) {
      console.error("Error generating random number:", error.message);
      return null;
    }
};

module.exports = { randomNumberDigits, randomNumberInRange };


// how to get in function 

// const randomNumber = randomNumberDigits(5);

// const randomNumber = randomNumberInRange(10, 100);
