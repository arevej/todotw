/* eslint-disable default-case */
import React from 'react';

import { css } from 'emotion';

let id = 0;

function Button({ text, onClick }) {
  return (
    <div className={styles.button} onClick={onClick}>{text}</div>
  )
}

function Block({ blockTitle, tasks, position, moveToNextBlock, moveToPrevBlock }) {
  return (
    <div className={styles.block}>
      <div className={styles.block_title}>
        {blockTitle}
      </div>
      <div className={styles.block_tasks}>
        {tasks.map(task =>
          <div className={styles.block_tasks_task} key={task.id}>
            <div className={styles.block_tasks_task_text}>
              {task.text}
            </div>
            {(() => {
              switch (position) {
                case 'beginning':
                  return <div className={css`${styles.block_tasks_task_buttons}; justify-content: flex-end; };`}>
                    <Button text="Next" onClick={moveToNextBlock(task.id)} />
                  </div>
                case 'middle':
                  return <div className={css`${styles.block_tasks_task_buttons}; justify-content: space-between; };`}>
                    <Button text="Prev" onClick={moveToPrevBlock(task.id)} />
                    <Button text="Next" onClick={moveToNextBlock(task.id)} />
                  </div>;
                case 'end':
                  return <div className={css`${styles.block_tasks_task_buttons}; justify-content: flex-start; };`}>
                    <Button text="Prev" onClick={moveToPrevBlock(task.id)} />
                  </div>;
              }
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

function Input({ value, onChange, onClickButton, buttonText }) {
  return (
    <div className={styles.input}>
      <input
        value={value}
        onChange={onChange}
        onKeyDown={evt => evt.keyCode === 13 ? onClickButton() : null}
        type='text'
      />
      <Button text={buttonText} onClick={onClickButton} />
    </div >
  )
}

class App extends React.Component {
  state = {
    typingTask: '',
    typingBlock: '',
    allBlocks: [
      { id: id++, title: 'todo' },
      { id: id++, title: 'in progress' },
      { id: id++, title: 'done' },
    ],
    allTasks: [
      {
        id: id++,
        blockId: 0,
        text: "Task 1"
      },
      {
        id: id++,
        blockId: 0,
        text: "Task 2"
      },
      {
        id: id++,
        blockId: 0,
        text: "Task 3"
      }
    ]
  }

  handleTypingTaskChange = (evt) => {
    this.setState({ typingTask: evt.target.value })
  }

  handleTypingBlockChange = (evt) => {
    this.setState({ typingBlock: evt.target.value })
  }

  addTask = () => {
    const { typingTask, allTasks, allBlocks } = this.state;
    const firstblockId = allBlocks[0].id;
    if (typingTask.trim().length !== 0) {
      const newAllTasks = [{ id: id++, blockId: firstblockId, text: typingTask }, ...allTasks];
      this.setState({ allTasks: newAllTasks, typingTask: '' })
    }
  }

  addBlock = () => {
    const { typingBlock, allBlocks } = this.state;
    if (typingBlock.trim().length !== 0) {
      const newAllBlocks = [...allBlocks, { id: id++, title: typingBlock }];
      this.setState({ allBlocks: newAllBlocks, typingBlock: '' })
    }
  }

  moveTaskToBlock = (taskId, blockId) => {
    const { allTasks } = this.state;
    const newAllTasks = allTasks.map(task => task.id === taskId ? { ...task, blockId: blockId } : task)
    this.setState({ allTasks: newAllTasks })
  }

  moveToNextBlock = (taskId) => () => {
    const { allTasks, allBlocks } = this.state;
    const task = allTasks.find(task => task.id === taskId);
    const currentBlock = allBlocks.find(block => block.id === task.blockId);
    const nextBlockIndex = allBlocks.indexOf(currentBlock) + 1 < allBlocks.length ? allBlocks.indexOf(currentBlock) + 1 : allBlocks.indexOf(currentBlock);
    const nextBlockId = allBlocks[nextBlockIndex].id;
    this.moveTaskToBlock(taskId, nextBlockId);
  }

  moveToPrevBlock = (taskId) => () => {
    const { allTasks, allBlocks } = this.state;
    const task = allTasks.find(task => task.id === taskId);
    const currentBlock = allBlocks.find(block => block.id === task.blockId);
    const prevBlockIndex = allBlocks.indexOf(currentBlock) - 1 >= 0 ? allBlocks.indexOf(currentBlock) - 1 : allBlocks.indexOf(currentBlock);
    const prevBlockId = allBlocks[prevBlockIndex].id;
    this.moveTaskToBlock(taskId, prevBlockId);
  }

  findPosition = (id) => {
    const { allBlocks } = this.state;
    const category = allBlocks.find(category => category.id === id)
    if (allBlocks.indexOf(category) === 0) {
      return "beginning"
    } else if (allBlocks.indexOf(category) === allBlocks.length - 1) {
      return "end"
    } else {
      return "middle"
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          TODODTW
        </div>
        <div className={styles.inputs}>
          <Input
            value={this.state.typingTask}
            onChange={this.handleTypingTaskChange}
            onClickButton={this.addTask}
            buttonText='Add'
          />
          <Input
            value={this.state.typingBlock}
            onChange={this.handleTypingBlockChange}
            onClickButton={this.addBlock}
            buttonText='Add block'
          />
        </div>
        <div className={styles.blocks}>
          {this.state.allBlocks.map(block =>
            <Block
              key={block.id}
              blockTitle={block.title}
              tasks={this.state.allTasks.filter(task => task.blockId === block.id)}
              position={this.findPosition(block.id)}
              moveToNextBlock={taskId => this.moveToNextBlock(taskId)}
              moveToPrevBlock={taskId => this.moveToPrevBlock(taskId)}
            />
          )}
        </div>
      </div>
    );
  }
}

const styles = {
  container: css`
    * {
      font-family: Helvetica;
      letter-spacing: 1px;
    }
    a {
      text-decoration: none;
    }
    width: 1200px;
    margin: 0 auto;
    `,

  header: css`
    color: red;
    font-size: 52px;
    font-weight: 600;
    text-align: center;
    margin-top: 35px;
    margin-bottom: 45px;
  `,
  inputs: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between; 
  `,
  blocks: css`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: scroll;
    margin-top: 20px;
  `,
  block: css`
    width: 300px;
    flex: 0 0 auto;
    border: 1px solid #aaa;
    border-radius: 7px;
    padding: 15px;
    margin-right: 20px;
  `,
  block_title: css`
    font-size: 26px;
    text-align: center;
    padding-bottom: 5px;
    border-bottom: 1px solid red;
  `,
  block_tasks: css`
    margin-top: 15px;
  `,
  block_tasks_task: css`
    margin-bottom: 15px;
    border: 1px solid #aaa;
    padding: 10px;
  `,
  block_tasks_task_text: css`
    font-size: 20px;
    margin-bottom: 45px;
  `,
  block_tasks_task_buttons: css`
    display: flex;
    flex-direction: row;
  `,
  input: css`
    input {
      font-size: 20px;
      padding: 8px 14px;
       margin-right: 20px;
    }
    display: flex;
    flex-direction: row;
  `,
  button: css`
    border: 2px solid red;
    border-radius: 5px;
    padding: 6px 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s;

    &:hover {
      background: red;
      color: white;
    }
`,


}

export default App;
