// The container for the instructions section
const generatorInstructionsContainer = document.getElementById('generator-instructions-container');
// The continue button for the generator instructions screen
const generatorInstructionsContinue = document.getElementById('generator-instructions-continue');

// The container for the email template section
const generatorTemplateContainer = document.getElementById('generator-email-template-container');
// The text box for the email template section
const generatorTemplateBox = document.getElementById('generator-template-box');
// The continue button for the generator email-template screen
const generatorEmailTemplateContinue = document.getElementById('generator-email-template-continue');

// The container for the mailing list section
const generatorMailingListContainer = document.getElementById('generator-mailinglist-container');
// The text box for the mailing list section
const generatorMailingListBox = document.getElementById('generator-mailinglist-box');
// The continue button for the generator mailing list screen
const generatorMailingListContinue = document.getElementById('generator-mailinglist-continue');

// The container for the settings list section
const generatorSettingsContainer = document.getElementById('generator-email-settings-container');
// The email subject
const generatorSubject = document.getElementById('generator-subject');
// The BCC address
const generatorBccAddress = document.getElementById('generator-bcc-address');
// The continue button for the generator settings screen
const generatorSettingsContinue = document.getElementById('generator-email-settings-continue');

// The container for the mail link generator
const generatorLinkContainer = document.getElementById('generator-link-container');
// The mail link itself
const generatorMailLink = document.getElementById('generator-mail-link');

// When the instructions continue button is clicked
generatorInstructionsContinue.addEventListener('click', (e) => {
  // Hide the instructions container and show the template input container
  generatorInstructionsContainer.classList.add('generator-hidden');
  generatorTemplateContainer.classList.remove('generator-hidden');

  // When the template input continue button is clicked
  generatorEmailTemplateContinue.addEventListener('click', (e) => {
    // Get the template data
    let templateData = generatorTemplateBox.value;

    // Hide the template input container and show the mailing list container
    generatorTemplateContainer.classList.add('generator-hidden');
    generatorMailingListContainer.classList.remove('generator-hidden');

    // When the mailing list continue button is clicked
    generatorMailingListContinue.addEventListener('click', (e) => {
      // Get the mailing list
      let mailingList;
      try {
        mailingList = generatorMailingListBox.value.split('\n');
      } catch (e) {
        alert('Invalid input to mailing list!');
        return;
      }

      // Hide the mailing list container and show the settings container
      generatorMailingListContainer.classList.add('generator-hidden');
      generatorSettingsContainer.classList.remove('generator-hidden');

      // When the generator settings container button is clicked
      generatorSettingsContinue.addEventListener('click', (e) => {
        // Get the BCC address
        let bccAddress = generatorBccAddress.value;
        let doBcc = bccAddress !== '';

        // Get the subject
        let subject = encodeURIComponent(generatorSubject.value);

        // Hide the settings container and show the mail link generator container
        generatorSettingsContainer.classList.add('generator-hidden');
        generatorLinkContainer.classList.remove('generator-hidden');

        const populateLink = () => {
          if (mailingList.length < 1) {
            // alert('No more emails!');
            return;
          }

          // Get the address and name
          let address, name;
          try {
            let mlData = mailingList.pop().split(',');
            address = mlData[1];
            name = mlData[0];
          } catch (e) {
            alert(`Invalid mailing list ${mlData}!`);
          }

          let body = encodeURIComponent(templateData.replaceAll('%NAME%', name));

          // Create a new link and modify the href
          generatorMailLink.href = `mailto:${address}?subject=${subject}&body=${body}`;
        }

        generatorMailLink.addEventListener('click', (e) => {
          populateLink();
        });
      })
    })
  });
})