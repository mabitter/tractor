## Platform

For user-facing and developer-facing UI, we've decided to make a bet on the web platform for its portability, development velocity, and developer community. The requirements of a robotics UI (3D visualization, high-frequency bidirectional data streams, etc.) are better addressed than ever by web technologies, and by staying in the web ecosystem we gain access to a vast set of resources.

The requirements of this frontend, however, are different than those of a traditional CRUD web application, and we should be careful not to cargo-cult frontend technologies and patterns that don't map well onto our application.

## Data Transport

We've made a bet on [WebRTC](https://webrtc.org/) for bidirectional streaming binary data and media, because of its optimized support for media (GPU-accelerated decoding, adaptive bitrate streaming), its peer-to-peer capabilities for remote monitoring / teleoperation scenarios (i.e. NAT traversal) and the configurability of the underlying transports (reliable vs. partially reliable, ordered vs. unordered).

HTTP will be used for RPC-style communication. Specifically, we're exploring the use of [Twirp](https://twitchtv.github.io/twirp/docs/spec_v5.html) for consistent API semantics and code-generated client stubs (see notes below on data serialization and type-safety).

## Data Serialization

We'd like to [stay consistent](https://github.com/farm-ng/tractor/blob/master/design/serialization.md) with the rest of the system and use protobuf for data serialization, and protobuf service definitions for the API definition.

## Language

We plan to use [Typescript](https://www.typescriptlang.org/) in the frontend, for the increased maintainability that type-safety gives projects as they grow, and, subjectively, the positive impact it makes on code quality and development velocity.

Combined with a unified approach to data serialization and API definition (see above), we should have a type-safe interface for all client-server communication.

## UI Framework

We plan to use [React](https://reactjs.org/) in the frontend for a consistent approach to declarative, composable UI. React is appealing, relative to other UI frameworks like [Angular](https://angular.io/) or [Vue](https://vuejs.org/), for its maturity, large developer community, and its familiarity to current and future team members.

## Build System

We use Webpack to build the frontend, primarily for its maturity and feature set, at the tradeoff of complexity relative to tools like [Rollup](https://rollupjs.org/guide/en/). We maintain our own Webpack build configuration, as opposed to relying on `create-react-app`, so that we understand every line of it and can easily extend it.

## State Management

Any sufficiently large React application will contain some state (e.g. `loggedInUser`) that must be shared between distant components in the hierarchy. This motivates the existence of state management libraries like [Redux](https://redux.js.org/), the [React Context API](https://reactjs.org/docs/context.html), and [MobX](https://mobx.js.org/).

After evaluating the above alternatives, in addition to patterns like [React Hook Singletons](https://github.com/peterbee/react-singleton), for the initial HMI feature set, we've made an initial bet on MobX. MobX is appealing because of its minimal boilerplate, and compatibility with [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview), which could be a very useful paradigm for managing all the streaming data we deal with.

> For anything that involves explictly working with the concept of time, or when you need to reason about the historical values / events of an observable (and not just the latest), RxJs is recommended as it provides more low-level primitives. Whenever you want to react to state instead of events, MobX offers an easier and more high-level approach. In practice, combining RxJS and MobX might result in really powerful constructions. Use for example RxJS to process and throttle user events and as a result of that update the state. If the state has been made observable by MobX, it will then take care of updating the UI and other derivations accordingly.

-- <cite>https://mobx.js.org/faq/faq.html#when-to-use-rxjs-instead-of-mobx</cite>
