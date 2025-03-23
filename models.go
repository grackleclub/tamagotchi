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

type activity struct {
	name   string
	points map[category]int
}

var activities = []activity{
	{
		name: "cycling",
		points: map[category]int{
			health:    2,
			education: 0,
			joy:       1,
			peace:     1,
		},
	},
	{
		name: "reading",
		points: map[category]int{
			health:    0,
			education: 3,
			joy:       1,
			peace:     1,
		},
	},
	{
		name: "cleaning",
		points: map[category]int{
			health:    2,
			education: 0,
			joy:       0,
			peace:     2,
		},
	},
}

type entry struct {
	time     time.Time
	activity activity
}

func pointsByActivity(entries []entry) map[string]int {
	points := make(map[string]int)
	for _, entry := range entries {
		for _, value := range entry.activity.points {
			points[entry.activity.name] += value
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
