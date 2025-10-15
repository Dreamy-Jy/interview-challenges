/**
Inbox App

Specifications
Build an inbox app. The app should display 2 panes.
The left pane should display a list of emails.
The right pane should display the selected email’s contents.

x - Display the following for each email in the list:
- Email subject
- Email sender
- Email date

x - Light grey background color for read emails, and white for unread emails

Clicking on an email should open it in the right pane. Mark the email as read when opened.

x - Display the following in the right pane:

x - Header section containing subject, sender, and date

x - Body section containing email content

x - Fetch the list of emails at this url: https://gist.githubusercontent.com/Jsarihan/d5f8cd2d159d676fbfb2fab94750635e/raw/b54cc1bd819b157a93bde00fe059825002f1f602/email.json.


x - Add a “Mark as Read” button at the top of the left pane.
x - Add a checkbox for each of the email list items.
x - Clicking “Mark as Read” should mark all checked emails as read.


Update the “Mark as Read” button to a “Mark as Unread” button if all checked emails are read.

Notes
Primary goal is functionality, not styling.

You can use Google to look up documentation, articles, and code examples.

You may install and use libraries for data fetching, styling, and state management.

TypeScript is not required.
*/

/**
Left and Right Panel

Start with a fetch on each page visit. Only one fetch. should be state not props.
*/
import "./App.css";
import { useEffect, useState } from "react";

const Email = ({ email }) => {
  return (
    <div>
      <h1>{email.subject}</h1>
      <b>{email.address}</b>
      <p>{email.time}</p>
    </div>
  );
};

const EmailListItem = ({ email, onSelectFn, selected, onClickEmail }) => {
  return (
    <div
      className="email-list-item"
      style={{
        backgroundColor: email.read ? "lightgrey" : "white",
      }}
    >
      <input type="checkbox" onClick={onSelectFn} checked={selected} />
      <div onClick={onClickEmail}>
        <Email email={email} />
      </div>
    </div>
  );
};

const EmailListPane = ({ emails, markEmailFn, onClickEmail }) => {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const setEmailsTo =
    selectedEmails.length > 0 &&
    selectedEmails.every((id) => {
      return emails[id - 1].read;
    });

  return (
    <div className="email-list">
      <button
        onClick={() =>
          selectedEmails.forEach((emailID) => {
            markEmailFn(emailID, !setEmailsTo);
          })
        }
      >
        {setEmailsTo ? "Mark As Unread" : "Mark As Read"}
      </button>
      <div>
        {emails.map((e) => (
          <EmailListItem
            email={e}
            onSelectFn={() => {
              setSelectedEmails((prevState) =>
                selectedEmails.includes(e.id)
                  ? prevState.filter((id) => id !== e.id)
                  : prevState.concat(e.id),
              );
            }}
            selected={selectedEmails.includes(e.id)}
            onClickEmail={() => {
              onClickEmail(e.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const EmailPane = ({ email }) => {
  const ui =
    JSON.stringify(email) === "{}" ? (
      <div>No email selected</div>
    ) : (
      <div>
        <Email email={email} />
        <div>{email.message}</div>
      </div>
    );

  return ui;
};

function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(-1);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/Jsarihan/d5f8cd2d159d676fbfb2fab94750635e/raw/b54cc1bd819b157a93bde00fe059825002f1f602/email.json",
    )
      .then((resp) => resp.json())
      .then((json) => {
        setEmails(
          json.map((e) => ({ ...e, read: e.read === "true" ? true : false })),
        );
      });
  }, []);

  return (
    <div className="App">
      <EmailListPane
        emails={emails}
        markEmailFn={(targetEmailID, read) => {
          setEmails((prevState) =>
            prevState.map((email) => {
              if (email.id !== targetEmailID) {
                return { ...email };
              }

              return { ...email, read };
            }),
          );
        }}
        onClickEmail={(targetEmailID) => {
          setSelectedEmail(targetEmailID);
          setEmails((prevState) =>
            prevState.map((email) => {
              if (email.id !== targetEmailID) {
                return { ...email };
              }

              return { ...email, read: true };
            }),
          );
        }}
      />
      <EmailPane email={selectedEmail < 0 ? {} : emails[selectedEmail - 1]} />
    </div>
  );
}

export default App;
