describe("registeration flow e2e test", () => {
  // note that every time after you run this test
  // you should go to mongDB to delete this user with userName "cypressUser"
  // so that next time this test can still be run since we don't allow duplicate userName in
  // the User collection
  it("passes when a can register a new user", () => {
    cy.visit("https://photocamp.herokuapp.com/");
    cy.get("#registerBtn").click();
    // register email
    cy.get("#regEmail").should("have.value", "");
    cy.get("#regEmail")
      .type("cypress@upenn.seas.edu")
      .should("have.value", "cypress@upenn.seas.edu");
    // register userName
    cy.get("#regUsername").should("have.value", "");
    cy.get("#regUsername")
      .type("cypressUser")
      .should("have.value", "cypressUser");
    // register password
    cy.get("#regPassword").should("have.value", "");
    cy.get("#regPassword")
      .type("cypressjjk")
      .should("have.value", "cypressjjk");
    // click the sign up button to create a new account
    cy.get("#signupBtn").click();
    // then on the login page, sign in with the new account
    cy.get("#userNameInput")
      .type("cypressUser")
      .should("have.value", "cypressUser");
    cy.get("#passwordInput")
      .type("cypressjjk")
      .should("have.value", "cypressjjk");
    cy.get("#signinBtn").contains("Sign In");
    cy.get("#signinBtn").click();
  });
});
