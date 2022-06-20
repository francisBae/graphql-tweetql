import { ApolloServer, gql } from "apollo-server";

const tweets = [
  {
    id: "1",
    text: "first one!",
  },
  {
    id: "2",
    text: "second one",
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
    lastName: String
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
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
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
