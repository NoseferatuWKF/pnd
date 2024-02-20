package main

import (
    "fmt"
    "log"
    "bufio"
    "os"
    "sync"
)

func main() {
    var input []string

    defer output(&input)

    ingest(&input)
}

func die(s string) {
    log.Fatalf("\x1b[;31;1m%s\x1b[;0m\n", s)
}

func ingest(input *[]string) {
    var wg sync.WaitGroup

    scanner := bufio.NewScanner(os.Stdin)
    if scanner.Err() != nil {
        die("Malformed Input")
    }

    for {
        scanner.Scan()
        line := scanner.Text()

        if len(line) == 0 {
            break
        }

        *input = append(*input, line)
    }

    // TODO: should be the number of --file args
    wg.Add(1)

    // use goroutines to emit to different targets
    go distribute(input, &wg)

    wg.Wait()
}

func distribute(input *[]string, wg *sync.WaitGroup) {
    // TODO: use file args to create file
    file, err := os.Create("test")

    if err != nil {
        die("Unable to create file")
    }

    var buf []byte
    for i := range *input {
        buf = append(buf, ((*input)[i] + "\n")...)
    }

    _, err = file.Write(buf)

    if err != nil {
        die("Unable to write to file")
    }

    wg.Done()
}

// TODO: demux stdout
func output(input *[]string) {
    for _, v := range *input {
        fmt.Println(v)
    }
}
