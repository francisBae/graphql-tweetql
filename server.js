import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first one!",
  },
  {
    id: "2",
    text: "second one",
  },
];

let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Musk",
  },
];

//type Query는 mandatory
/*
type Query{
  hello:String
}
은 rest에서 GET /hello 생각하면 됨
alias를 사용하면 Query 대신 다른 이름도 사용 가능

*/
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

//Query 등 명칭은 Apollo가 해석해야 하므로 동일 이름으로 해야 함
//인자들은 2번째 위체 (아래는 args)에 들어감 (root 쓰고 2번째에 args 써주기) 0 graphql의 명세 //tweet(root, args){ .. }
//{id}처럼 쓰는 것도 가능 //
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    ping() {
      return "pong";
    },
    allUsers() {
      console.log("allUsers called");
      return users;
    },
  },
  Mutation: {
    postTweet(__, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text: text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(__, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      //root에는 이를 호출한 곳의 데이터가 있음 (여기서는 allUsers의 데이터)
      //root자리에서 {} 로 접근해서 root의 정보 가져오는 것 가능
      console.log("fullName called");
      // console.log(root);
      return `${firstName} ${lastName}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
