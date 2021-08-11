const client = require('../lib/client');
// import our seed data:
const friends = require('./friends.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      

    await Promise.all(
      friends.map(friend => {
        return client.query(`
                    INSERT INTO friends (name, cool_factor, cool_haircut)
                    VALUES ($1, $2, $3);
                `,
        [friend.name, friend.cool_factor, friend.cool_haircut]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
