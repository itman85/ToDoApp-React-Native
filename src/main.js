import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
} from 'react-native';

module.exports = React.createClass({
  getInitialState(){
    return ({
      tasks:[],
      completedTasks: [],
      task:''
    })
  },
  componentWillMount(){
    console.log('componentWillMount');
    AsyncStorage.getItem('tasks')
      .then((response) => {
        //console.log('tasks: '+ response)
        if(response!=null)
          this.setState({tasks: JSON.parse(response)})
        else
          this.setState({tasks: []})
      });
    AsyncStorage.getItem('completedTasks')
      .then((response) => {
        //console.log('completedTasks: '+ response)
        if(response!=null)
          this.setState({completedTasks: JSON.parse(response)})
        else
            this.setState({completedTasks: []})
      });
  },
  componentDidUpdate() {
    console.log('componentDidUpdate');
      this.setStorage();
    },
  setStorage() {
      AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
      AsyncStorage.setItem('completedTasks', JSON.stringify(this.state.completedTasks));
    },

  addTask() {
      let tasks = this.state.tasks.concat([this.state.task]);
      this.refs['txtAddTask'].setNativeProps({text: ''});//clear text input
      this.setState({tasks})


    },

    completeTask(index){
      let tasks = this.state.tasks;
      tasks = tasks.slice(0, index).concat(tasks.slice(index+1));

      let completedTasks = this.state.completedTasks;
      completedTasks = completedTasks.concat([this.state.tasks[index]]);

      this.setState({
        tasks,
        completedTasks
      });


    },

    deleteTask(index) {
        let completedTasks = this.state.completedTasks;
        completedTasks = completedTasks.slice(0, index).concat(completedTasks.slice(index+1));
        this.setState({completedTasks});


      },

  renderList(tasks){
    console.log('renderList');
    return (
      tasks.map((task,index) => {
        return (
          <View key={task} style={styles.task}>
            <Text>
              {task}
            </Text>

            <TouchableOpacity
            onPress={()=>this.completeTask(index)}>
            <Text>
             &#10003;
            </Text>
            </TouchableOpacity>
          </View>
        )
      })
    )
  },

  renderCompleted(tasks) {
    console.log('renderCompleted');
   return (
     tasks.map((task, index) => {
       return (
         <View key={task} style={styles.task}>
           <Text style={styles.completed}>
             {task}
           </Text>
           <TouchableOpacity
             onPress={()=>this.deleteTask(index)}
           >
             <Text>
               &#10005;
             </Text>
           </TouchableOpacity>
         </View>
       )
     })
   )
 },

//main render
  render(){
    console.log('render');
    return(
      <View style={styles.container}>
      <Text style={styles.header}>
          To-Do Master
      </Text>
      <TextInput
                style={styles.input}
                placeholder='Add a task...'
                onChangeText={(text) => {
                  this.setState({task: text});
                  //console.log(this.state.task);
                }}
                onEndEditing={()=>this.addTask()}
                ref={'txtAddTask'}
        />
        <ScrollView>
        {this.renderList(this.state.tasks)}
        {this.renderCompleted(this.state.completedTasks)}
        </ScrollView>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 30,
    marginTop: 40,
    textAlign: 'center',
    fontSize: 18
  },
  task: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderColor: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    textAlign: 'center',
    margin: 10
  },
  completed: {
    color: '#555',
    textDecorationLine: 'line-through'
  }
})
