const User = require('../models/user_model');
const mongoose = require('mongoose');
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const schedule = require('node-schedule');
// sgMail.setApiKey('')

const UserController = {};

/**
 * Creates a user
 * @function
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
UserController.createUser = async (req, res) => {
  const email = req.body.email;
  //  Check if user with the same email already exists
  let user = await User.findOne({ email });
  if (user !== null) {
    return res
      .status(400)
      .send({ error: 'A user with the same email already exists' });
  }
  try {
    user = new User({ _id: new mongoose.Types.ObjectId(), ...req.body });
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'An error has been encountered. ' });
  }
};

/**
 * GET all users
 */
UserController.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

/**
 * Method to update a user
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
UserController.updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const user = await User.findOne({ _id: req.params.id });
  try {
    updates.forEach(update => {
      user[update] = req.body[update];
    });
    await user.save();
    res.send({ message: 'Your details updated successfully', user });
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
 * Method to add user's fav subreddits
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
UserController.addSubReddits = async (req, res) => {
  const updates = Object.keys(req.body);
  const user = await User.findOne({ _id: req.params.id });
  try {
    user.favSubReddits = arrayUnique(user.favSubReddits.concat(req.body.favSubReddits));
    await user.save();
    res.send({ message: 'SubReddit(s) has beem added successfully', user });
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
* Method to remove specific subReddit from the list
* @param req
* @param res
* @returns {Promise<void>}
*/
UserController.updateSubReddits = async (req, res) => {
  console.log(req.body)
  try {
    let user = await User.updateOne({ _id: req.params.id }, { $pull: { favSubReddits: { $in: req.body.favSubReddits } } });
    res.send({ message: 'Remove successful', user });
  } catch (e) {
    res.status(400).send(e);
  }
};


/**
* Method to turn on or off email notifications for specific user
* @param req
* @param res
* @returns {Promise<void>}
*/
UserController.updateEmailNotifications = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    await User.findByIdAndUpdate({ _id: req.params.id }, { $set: { emailNotification: !user.emailNotification } })
    res.send({ message: 'Email Notification changes updated' });
  } catch (e) {
    res.status(400).send(e);
  }
};

/**
* Method to send email notifications to the user
* @param req
* @param res
* @returns {Promise<void>}
*/
UserController.sendScheduledEmail = schedule.scheduleJob('0 00 08 * * *', async () => {
  try {
    let topThreePosts = [];
    let arr;
    const users = await User.find();
    for (let i = 0; i < users.length; i++) {
      if (users[i].emailNotification) { // check if emailnotification is on/off for the user
        if (users[i].favSubReddits.length > 0) {
          arr = users[i].favSubReddits;
        }
        for (let j = 0; j < arr.length; j++) {
          const response = await axios.get('https://www.reddit.com/r/'
            + arr[j] + '.json')
          let topPosts = []
          topPosts.push(...response.data.data.children)

          const statsByUser = {};

          topPosts.forEach(({ data: { title, score } }) => {
            statsByUser[title] = !statsByUser[title]
              ? { score } // score
              : {
                score: statsByUser[title].score + score,
              };
          });

          const userList = Object.keys(statsByUser).map(title => ({
            title,
            score: statsByUser[title].score,
          }));
          const sortedList = userList.sort((userA, userB) => userB.score - userA.score);
          topThreePosts.push(sortedList.slice(0, 3))

        }
        await UserController.sendEmail(topThreePosts, users[i]);
        topThreePosts = []
      }

    }
  } catch (e) {
  console.log(e)
  }

});

UserController.sendEmail = async (postsList, userDetails) => {
  let post;
  let table = '';
  for (let i = 0; i < postsList.length; i++) {
    post = postsList[i]
 
    for (let j = 0; j < post.length; j++) {
      table += '<tr style= "margin-top:25px">';
      table += '<td style = "text-align: center, serif; font-weight: 700; color:#e55227;">' + post[j].title + '-' + post[j].score + '</td>'
      table += '</tr><br>'
    }
 
  }
  try {
    const msg = {
      to: userDetails.email,
      from: '',
      subject: "Reddit today's top 3 voted posts",
      text: 'Reddit Newsletter',
      html: `<html>
    <head></head>
    <body>
    <p>Hi ` + userDetails.firstName + `,</p>
    <table cellpadding="0" cellspacing="0" width="100%" border="0" align="center">

		<tr>
			<td>
				<table cellpadding="0" cellspacing="0" width="600" align="center" class="width100">
					<tr>
						<td>
							<table cellpadding="0" cellspacing="0" width="300" border="0" align="center" class="width100">
								<tr>
									<td align="center">
											<img src= "https://www.audibene.de/wp-content/uploads/sites/2/2020/02/audibene-claim-rgb-logo-safe-zone-850.svg" alt="Audibene Logo" style="max-width: 600px" class="width100"/>
										
									</td>
								</tr>
							</table>
							<table cellpadding="0" cellspacing="0" width="100%" border="0" text-align="center" class="width100">
								<tr>
									<td>
										<h2 style="text-align: center; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 30px; margin: 20px">
											Reddit Newsletter
										</h2>
									</td>
								</tr>
								<tr><td height="20"></td></tr>
							</table>
              <table cellpadding="0" cellspacing="0" width="100%" border="0" align="center" class="width100 center">
              <thead>
              <tr>
                 <th>See today's top voted posts from your favorite channel</th>
              </tr>
            </thead>
								<tr>
									<td>
										<table cellpadding="0" cellspacing="0" align="center" class="width100" border="0" width="600">
											<tr>
												<td>
													<table cellpadding="0" cellspacing="0" width="100%" border="0" align="left" class="width100">`
                           + table + `
														<tr><td height="20"></td></tr>
													</table>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
    </body>
    </html>`
    }
    await sgMail.send(msg)
  } catch (e) {
    res.status(400).send(e);
  }

}


//unique subReddit value check
function arrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }

  return a;
}

module.exports = UserController;
