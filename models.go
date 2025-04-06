package main

import "time"

type category string

const (
	health    category = "health"
	education category = "education"
	peace     category = "peace"
	joy       category = "joy"
)

var (
	categories = []category{health, education, peace, joy}
)

type Activity struct {
	Name   string
	points map[category]int
}

var activities = []Activity{
	{
		Name: "cycling",
		points: map[category]int{
			health:    2,
			education: 0,
			joy:       1,
			peace:     1,
		},
	},
	{
		Name: "reading",
		points: map[category]int{
			health:    0,
			education: 3,
			joy:       1,
			peace:     0,
		},
	},
	{
		Name: "cleaning",
		points: map[category]int{
			health:    2,
			education: 0,
			joy:       0,
			peace:     0,
		},
	},
}

type entry struct {
	time     time.Time
	activity Activity
}

func pointsByActivity(entries []entry) map[string]int {
	points := make(map[string]int)
	for _, entry := range entries {
		for _, value := range entry.activity.points {
			points[entry.activity.Name] += value
		}
	}
	return points
}

func pointsByCategory(entries []entry) map[category]int {
	points := make(map[category]int)
	for _, entry := range entries {
		for category, value := range entry.activity.points {
			points[category] += value
		}
	}
	return points
}
