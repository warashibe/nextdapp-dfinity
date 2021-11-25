import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

actor Todos {

  stable var todos : [ToDo] = [];
  stable var nextId : Nat = 1;

  type ToDo = {
    id : Nat;
    description : Text;
    completed : Bool;
  };

  func add(todos : [ToDo], description : Text, id : Nat) : [ToDo] {
    let todo : ToDo = {
      id = id;
      description = description;
      completed = false;
    };
    Array.append(todos, [todo])
  };

  public query func getTodos() : async [ToDo] {
    todos;
  };

  public func addTodo (description : Text) : async () {
    todos := add(todos, description, nextId);
    nextId += 1;
  };

  public func markDone(id : Nat) : async () {
    todos := Array.map<ToDo,ToDo>(todos, func (todo : ToDo) : ToDo {
      if (todo.id == id) {
        return {
          id = todo.id;
          description = todo.description;
          completed = true;
        };
      };
      todo
    })
  };

  public func removeTodo(id : Nat) : async () {
    todos := Array.filter<ToDo>(todos, func (todo : ToDo) : Bool {
        return todo.id != id;
    })
  };

};
