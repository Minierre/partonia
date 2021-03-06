const db = require('../server/db')
const {
  User,
  Room,
  Mutations,
  Selections,
  RoomMutations,
  Parameters,
  RoomParameters
} = require('../server/db/models')

const {
  findString,
  helloWorld,
  gameOfLifeFitness,
  gameOfLifeFitnessLoopers,
  crossOver,
  randomSettingMutation,
  swapMutation,
  rouletteWheel,
  fittest
} = require('./fixtureFunctions')

async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')
  // Whoa! Because we `await` the promise that db.sync returns, the next line will not be
  // executed until that promise resolves!

  const users = await Promise.all([
    User.create({ email: 'cody@email.com', password: '123', isAdmin: false }),
    User.create({ email: 'murphy@email.com', password: '123', isAdmin: false }),
    User.create({ email: 'admin@admin.com', password: '123', isAdmin: true })
  ])

  const mutations = await Promise.all([
    Mutations.create({ function: crossOver, name: 'Cross Over' }),
    Mutations.create({ function: randomSettingMutation, name: 'Random Setting Mutation' }),
    Mutations.create({ function: swapMutation, name: 'Swap Mutation' }),
  ])

  const selections = await Promise.all([
    Selections.create({ function: rouletteWheel, name: 'Roulette Wheel' }),
    Selections.create({ function: fittest, name: 'Fittest' }),
  ])

  const rooms = await Promise.all([
    Room.create({
      roomName: 'Game of Life',
      fitnessFunc: gameOfLifeFitness,
      selectionId: 1,
      userId: null
    }),
    Room.create({
      roomName: 'Game of Life Loopers',
      fitnessFunc: gameOfLifeFitnessLoopers,
      selectionId: 1,
      userId: 3
    }),
    Room.create({
      roomName: 'String Matcher',
      fitnessFunc: findString,
      selectionId: 2,
      userId: null
    }),
    Room.create({
      roomName: 'Hello World',
      fitnessFunc: helloWorld,
      selectionId: 1,
      userId: null
    })
  ])

  const parameters = await Promise.all([
    Parameters.create({
      chromosomeLength: 100,
      generations: 7,
      elitism: 0,
      populationSize: 100,
      fitnessGoal: 1000000000,
      reproductiveCoefficient: 10
    }),
    Parameters.create({
      chromosomeLength: 100,
      generations: 7,
      elitism: 0,
      populationSize: 100,
      fitnessGoal: 1000000000,
      reproductiveCoefficient: 10
    }),
    Parameters.create({
      chromosomeLength: 11,
      generations: 200,
      elitism: 0,
      populationSize: 200,
      fitnessGoal: 1000000000,
      reproductiveCoefficient: 100,
      genePool: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z, ,.'
    }),
    Parameters.create({
      chromosomeLength: 10,
      generations: 200,
      elitism: 10,
      populationSize: 2000,
      fitnessGoal: 100000000,
      reproductiveCoefficient: 1000,
      genePool: '=,>, ,",(,),hello,world,{,},;,.'
    })
  ])

  const roomParameters = await Promise.all([
    RoomParameters.create({
      roomId: 1,
      parameterId: parameters[0].id
    }),
    RoomParameters.create({
      roomId: 2,
      parameterId: parameters[1].id
    }),
    RoomParameters.create({
      roomId: 3,
      parameterId: parameters[2].id
    }),
    RoomParameters.create({
      roomId: 4,
      parameterId: parameters[3].id
    })
  ])

  const roomMutations = await Promise.all([
    RoomMutations.create({
      mutationId: 1,
      roomId: rooms[0].id,
      chanceOfMutation: .05
    }),
    RoomMutations.create({
      mutationId: 2,
      roomId: rooms[0].id,
      chanceOfMutation: .05
    }),
    RoomMutations.create({
      mutationId: 1,
      roomId: rooms[1].id,
      chanceOfMutation: .05
    }),
    RoomMutations.create({
      mutationId: 2,
      roomId: rooms[1].id,
      chanceOfMutation: .05
    }),
    RoomMutations.create({
      mutationId: 3,
      roomId: rooms[2].id,
      chanceOfMutation: 0.2
    }),
    RoomMutations.create({
      mutationId: 2,
      roomId: rooms[2].id,
      chanceOfMutation: 0.2
    }),
    RoomMutations.create({
      mutationId: 1,
      roomId: rooms[3].id,
      chanceOfMutation: 0.005
    }),
    RoomMutations.create({
      mutationId: 2,
      roomId: rooms[3].id,
      chanceOfMutation: 0.15
    }),
    RoomMutations.create({
      mutationId: 3,
      roomId: rooms[3].id,
      chanceOfMutation: 0.002
    })
  ])

  // Wowzers! We can even `await` on the right-hand side of the assignment operator
  // and store the result that the promise resolves to in a variable! This is nice!
  console.log(`seeded ${users.length} users`)
  console.log('seeded successfully')
}

// Execute the `seed` function
// `Async` functions always return a promise, so we can use `catch` to handle any errors
// that might occur inside of `seed`
seed()
  .catch((err) => {
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('closing db connection')
    db.close()
    console.log('db connection closed')
  })

/*
 * note: everything outside of the async function is totally synchronous
 * The console.log below will occur before any of the logs that occur inside
 * of the async function
 */
console.log('seeding...')
