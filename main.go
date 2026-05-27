package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

func WingetInstalled() bool {
	cmd := exec.Command("winget", "install", "Inkscape.Inkscape")
	out, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println(err)
		return false
	}

	log.Println("version of winget: " + string(out))
	return true
}

func InstallInkScape() error {
	out, err := exec.Command("winget", "install", "Inkscape.Inkscape").CombinedOutput()
	if err != nil {
		return err
	}

	fmt.Println("Installation log: " + string(out))
	return nil
}

func Convert(name, outputName string) error {
	out, err := exec.Command(
		"inkscape",
		name+".cdr",
		"--export-type=pdf",
		"--export-filename=output/"+outputName+".pdf",
	).CombinedOutput()

	if err != nil {
		return err
	}

	log.Println("Converter log: " + string(out))

	return nil
}

func main() {
	fileinfo, err := os.Stat("temp")
	if fileinfo.IsDir() == false || err != nil {
		out, err := exec.Command(
			"cmd",
			"/C",
			"script.bat",
		).CombinedOutput()
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("Initialization completed successfully")
		log.Println("Initialization log: " + string(out))
	} else {
		log.Println("Folders already created. Skip initialization")
	}

}
