const { ApolloServer, gql } = require('apollo-server');

let documents = [
  {
    id: 1,
    contentData: '# Hello world',
  },
  {
    id: 2,
    contentData: '# Hello world 2',
  },
];

const typeDefs = gql`
  type Query {
    documents: [Document]
    document(id: Int): Document
  }
  type Document {
    id: Int
    contentData: String
  }
  type Mutation {
    addDocument(contentData: String!): Document
    removeDocument(id: Int!): [Document]
    changeDocumentContent(id: Int!, contentData: String!): Document
  }
`;

const resolvers = {
  Query: {
    document: (_, args) => documents.filter(e => e.id === args.id)[0],
    documents: () => documents,
  },
  Mutation: {
    addDocument: (_, args) => {
      const newDocument = {
        id: documents.length + 1,
        contentData: args.contentData,
      };
      documents.push(newDocument);
      return newDocument;
    },
    removeDocument: (_, args) => {
      return documents.filter(e => e.id !== args.id)
    },
    changeDocumentContent: (_, args) => {
      let newDocument;
      // Change documents
      documents = documents.map(e => {
        if(e.id === args.id) {
          newDocument = {
            ...e,
            contentData: args.contentData,
          };
          return newDocument
        };
        return e;
      });
      // Return change document
      return newDocument;
    },
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`Server is ready at ${url}`)
});
