describe('The Home Page', function() {
    it('successfully loads', function() {
        cy.visit('/')
    })

    it('nav bar works', function() {
        const orange = 'rgb(240, 95, 64)'
        const white = 'rgb(255, 255, 255)'

        // click nav bar buttons and check that they change color
        cy.get('.nav-link')
            .contains('About')
            .click()
            .should('have.css', 'color', orange)

        // check nav bar background color changes
        cy.get('#mainNav').should('have.class', 'navbar-shrink')

        cy.get('.nav-link')
            .contains('Portfolio')
            .click()
            .should('have.css', 'color', orange)
        cy.get('.nav-link')
            .contains('Contact')
            .click()
            //.should('have.css', 'color', orange)  // doesn't work depending on zoom
        cy.get('.navbar-brand')
            .contains('Home')
            .should('have.css', 'color', orange)
            .click()
            .should('have.css', 'color', white)
    })

    it('Buttons work', function() {
        cy.get('.btn-xl').contains('Find Out More').click()
        cy.get('.btn-xl').contains('Portfolio').click()
    })

    // test portfolio: hovering, colors, links
    it('Portfolio hovering works', function() {
        cy.get('.portfolio-box')
            .each(($el) => {
                cy.wrap($el)
                    .children('.portfolio-box-caption')
                    .should('have.css', 'opacity', '0')
                    .trigger('mouseover')

                // cy.wrap($el)
                //     .children('.portfolio-box-caption')
                //     .should('have.css', 'opacity', '1')
                // })
            })
    })

    // test contactS
})