/// <reference types="Cypress" />
import { PartialViewBuilder } from "../../../src";

context('Partial Views', () => {

  beforeEach(() => {
    cy.umbracoLogin(Cypress.env('username'), Cypress.env('password'));
  });

  function openPartialViewsCreatePanel() {
    cy.umbracoSection('settings');
    cy.get('li .umb-tree-root:contains("Settings")').should("be.visible");
    cy.umbracoTreeItem("settings", ["Partial Views"]).rightclick();
  }

  it('Create new empty partial view', () => {
    const name = "TestPartialView";
    const fileName = name + ".cshtml";

    cy.umbracoEnsurePartialViewNameNotExists(fileName);

    openPartialViewsCreatePanel();

    cy.umbracoContextMenuAction("action-create").click();
    cy.get('.menu-label').first().click(); // TODO: Fucked we cant use something like cy.umbracoContextMenuAction("action-mediaType").click();

    //Type name
    cy.umbracoEditorHeaderName(name);

    //Save
    cy.get('.btn-success').click();

    //Assert
    cy.umbracoSuccessNotification().should('be.visible');

    //Clean up
    cy.umbracoEnsurePartialViewNameNotExists(fileName);
  });

  it('Create partial view from snippet', () => {
    const name = "TestPartialViewFromSnippet";
    const fileName = name + ".cshtml";

    cy.umbracoEnsurePartialViewNameNotExists(fileName);

    openPartialViewsCreatePanel();

    cy.umbracoContextMenuAction("action-create").click();
    cy.get('.menu-label').eq(1).click();
    // Select snippet
    cy.get('.menu-label').eq(2).click();

    // Type name
    cy.umbracoEditorHeaderName(name);

    // Save
    cy.get('.btn-success').click();

    // Assert
    cy.umbracoSuccessNotification().should('be.visible');
    // Maybe check that the partial view was actually create with an api call?

    // Clean up
    cy.umbracoEnsurePartialViewNameNotExists(fileName);
  });

  it('Partial view with no name', () => {
    openPartialViewsCreatePanel();

    cy.umbracoContextMenuAction("action-create").click();
    cy.get('.menu-label').first().click();

    // Click save
    cy.get('.btn-success').click();

    // Assert
    cy.umbracoErrorNotification().should('be.visible');
  });

  it('Delete partial view', () => {
    const name = "TestDeletePartialView";
    const fileName = name + ".cshtml";

    cy.umbracoEnsurePartialViewNameNotExists(fileName);

    // Build and save partial view
    const partialView = new PartialViewBuilder()
      .withName(name)
      .withContent("@inherits Umbraco.Web.Mvc.UmbracoViewPage")
      .build();
    
    cy.savePartialView(partialView);

    cy.umbracoSection('settings');
    cy.get('li .umb-tree-root:contains("Settings")').should("be.visible");

    // Delete partial view
    cy.umbracoTreeItem("settings", ["Partial Views", fileName]).rightclick();
    cy.umbracoContextMenuAction("action-delete").click();
    cy.umbracoButtonByLabelKey("general_ok").click();

    // Assert 
    cy.contains(fileName).should('not.exist');

    // Clean 
    cy.umbracoEnsurePartialViewNameNotExists(fileName);
  });

});
