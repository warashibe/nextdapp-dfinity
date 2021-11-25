import { useState, useEffect } from "react"
import { isNil, map } from "ramda"
import { bind } from "nd"
import { Box, Flex } from "rebass"
import { Input } from "@rebass/forms"

import dfx from "nd/dfx"

const style = {
  add: {
    bg: "#eee",
    p: 2,
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    cursor: "pointer",
    width: "35px",
    ":hover": { opacity: 0.75 },
  },
}

export default () => {
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState([])
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    ;(async () => setTodos(await dfx("todo").getTodos()))()
  }, [])

  return (
    <Flex justifyContent="center">
      <Box maxWidth="600px" p={3}>
        <Flex mb={2}>
          <Input
            disabled={adding ? "disabled" : ""}
            value={task}
            onChange={e => setTask(e.target.value)}
            flex={1}
          />
          <Flex
            sx={style.add}
            onClick={async () => {
              if (!adding && !/^\s*$/.test(task)) {
                setAdding(true)
                await dfx("todo").addTodo(task)
                setTodos(await dfx("todo").getTodos())
                setTask("")
                setAdding(false)
              }
            }}
          >
            {adding ? (
              <Box as="i" className="fas fa-spin fa-circle-notch" />
            ) : (
              <Box as="i" className="fas fa-plus" />
            )}
          </Flex>
        </Flex>
        {map(v => (
          <Flex width={1}>
            <Box
              flex={1}
              sx={style.task}
              onClick={async () => {
                if (!v.completed) {
                  setProcessing(v.id)
                  await dfx("todo").markDone(v.id)
                  setTodos(await dfx("todo").getTodos())
                  setProcessing(null)
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
              width="50px"
              sx={style.remove}
              onClick={async () => {
                if (isNil(processing)) {
                  setProcessing(v.id)
                  await dfx("todo").removeTodo(v.id)
                  setTodos(await dfx("todo").getTodos())
                  setProcessing(null)
                }
              }}
            >
              {processing === v.id ? (
                <Box as="i" className="fas fa-spin fa-circle-notch" />
              ) : (
                <Box as="i" className="fas fa-times" />
              )}
            </Flex>
          </Flex>
        ))(todos)}
      </Box>
    </Flex>
  )
}
