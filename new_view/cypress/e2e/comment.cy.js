describe("comment a post flow e2e test", () => {
  it("passes when a user can log in and comment a post", () => {
    cy.visit("https://photocamp.herokuapp.com/");
    // input user info and log in
    cy.get("#userNameInput").type("john2").should("have.value", "john2");
    cy.get("#passwordInput").type("john2").should("have.value", "john2");
    cy.get("#signinBtn").contains("Sign In");
    cy.get("#signinBtn").click();

    // select the top post and make a comment
    cy.get(".openComment").first().click();
    cy.get(".commentField").first().type("comment from cypress");
    cy.get(".postCommentBtn").first().click();
    cy.get(".myComment").first().contains("comment from cypress");
    cy.get(".deleteCyComment").first().click();
  });
});
