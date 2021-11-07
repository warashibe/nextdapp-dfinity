import { useState, useEffect } from "react"
import { map } from "ramda"
import { bind } from "nd"
import { Box, Flex } from "rebass"
import { Input } from "@rebass/forms"

import dfx from "nd/dfx"

const style = {
  add: {
    bg: "#eee",
    p: 2,
    justifyContent: "center",
    width: "50px",
    cursor: "pointer",
    ":hover": { opacity: 0.75 },
  },
  task: {
    bg: "#eee",
    my: 1,
    px: 3,
    py: 2,
    cursor: "pointer",
    ":hover": { opacity: 0.75 },
  },
  remove: {
    ml: 1,
    bg: "#eee",
    my: 1,
    px: 3,
    py: 2,
    justifyContent: "center",
    cursor: "pointer",
    width: "35px",
    ":hover": { opacity: 0.75 },
  },
}

export default () => {
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState([])

  useEffect(() => {
    ;(async () => setTodos(await dfx("nxd").getTodos()))()
  }, [])

  return (
    <Flex justifyContent="center">
      <Box maxWidth="600px" p={3}>
        <Flex mb={2}>
          <Input
            value={task}
            onChange={e => setTask(e.target.value)}
            flex={1}
          />
          <Flex
            sx={style.add}
            onClick={async () => {
              if (!/^\s*$/.test(task)) {
                await dfx("nxd").addTodo(task)
                setTodos(await dfx("nxd").getTodos())
                setTask("")
              }
            }}
          >
            Add
          </Flex>
        </Flex>
        {map(v => (
          <Flex width={1}>
            <Box
              flex={1}
              sx={style.task}
              onClick={async () => {
                if (!v.completed) {
                  await dfx("nxd").markDone(v.id)
                  setTodos(await dfx("nxd").getTodos())
                }
              }}
            >
              <Box
                color={v.completed ? "red" : "black"}
                as={v.completed ? "s" : ""}
              >
                {v.description}
              </Box>
            </Box>
            <Flex
              sx={style.remove}
              onClick={async () => {
                await dfx("nxd").removeTodo(v.id)
                setTodos(await dfx("nxd").getTodos())
              }}
            >
              x
            </Flex>
          </Flex>
        ))(todos)}
      </Box>
    </Flex>
  )
}
