var Suggestion = artifacts.require("./Suggestion.sol");

module.exports = function(deployer) {
  deployer.deploy(Suggestion);
};
