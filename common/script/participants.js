function getParticipants() {
    // Define the W3C's group ID
    const GROUP_ID = "83726";

    // Define the base URL for the API, using the group ID
    const BASE_URL = `https://api.w3.org/groups/${GROUP_ID}`;

    // Define the ID of the list element where the user information will be inserted
    const LIST_ID = "ack_group";

    /**
     * Fetches users and their affiliations from the API and returns an array of user information.
     * Each element in the array is an object containing the user's title and affiliation.
     *
     * @async
     * @function getUsersInfo
     * @returns {Promise<Array<{title: string, affiliation: string}>>} - A promise that resolves to an array of user information.
     */
    async function getUsersInfo() {
        // Send a GET request to the users endpoint
        const response = await fetch(`${BASE_URL}/users`);
        // Fetch the JSON data from the response
        const data = await response.json();
        // Extract the list of users
        const users = data._links.users;

        // Initialize an empty array to store user information
        let usersInfo = [];
        // Iterate over each user
        for (const user of users) {
            // Fetch the affiliation of the current user
            const affiliation = await getAffiliation(user);
            // Push an object containing the user's title and affiliation to the usersInfo array
            usersInfo.push({ title: user.title, affiliation: affiliation });
        }
        // Return the array containing information of all users
        return usersInfo;
    }

    /**
     * Fetches the affiliation of a given user from the API.
     *
     * @async
     * @function getAffiliation
     * @param {Object} user - The user object.
     * @returns {Promise<string>} - A promise that resolves to the title of the user's affiliation.
     */
    async function getAffiliation(user) {
        // Send a GET request to the affiliations endpoint of the user
        const response = await fetch(user.href + "/affiliations/");

        // Fetch the JSON data from the response
        const affiliations = await response.json();

        // Extract the title of the first affiliation
        const affiliation = affiliations._links.affiliations[0].title;

        // Return the title of the affiliation
        return affiliation;
    }

    /**
     * Fetches users and their affiliations, creates a list item for each user with their title and affiliation,
     * and appends these list items to a specified list in the document.
     *
     * @async
     * @function insertUsersInfoIntoDocument
     */
    async function insertUsersInfoIntoDocument() {
        const usersInfo = await getUsersInfo();
        const usersList = document.querySelector(`#${LIST_ID} ul`);

        for (const user of usersInfo) {
            const li = document.createElement("li");
            li.textContent = `${user.title} (${user.affiliation})`;
            usersList.appendChild(li);
        }
    }

    insertUsersInfoIntoDocument();
}
