# mobx-class-transformer-validator

A simple plugin for [class-transformer](https://github.com/typestack/class-transformer) and [class-validator](https://github.com/typestack/class-validator) which combines them in a nice and programmer-friendly API.

## Installation

#### Module installation

`npm install mobx-class-transformer-validator --save`

(or the short way):

`npm i -S mobx-class-transformer-validator`

#### Peer dependencies

This package is only a simple plugin/wrapper, so you have to install the required modules too because it can't work without them. See detailed installation instruction for the modules installation:

- [class-transformer](https://github.com/typestack/class-transformer#installation)
- [class-validator](https://github.com/typestack/class-validator#installation)

## Usage

The usage of this module is very simple.

```ts
import { IsEmail } from 'class-validator';
import { transformAndValidate } from 'mobx-class-transformer-validator';

class UserDto {
  @IsString()
  fullname: string;
}

class UserModel {
  @observable firstName: string;
  @observable lastName: string;
  @computed get fullname() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const user = new UserModel();

// transform the JSON to class instance and validate it correctness
transformAndValidate(UserDto, UserModel)
  .then((userDto: UserDto) => {
    // now you can access all your class prototype method
    console.log(`Hello ${userDto.fullname}`); // prints "Hello World!" on console
  })
  .catch((err) => {
    // here you can handle error on transformation (invalid JSON)
    // or validation error (e.g. invalid email property)
    console.error(err);
  });
```
