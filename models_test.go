package main

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

var (
	sampleEntryQty = 12
	entries        []entry
)

func init() {
	entries = sampleEntries(sampleEntryQty)
}

func TestPointsByActivity(t *testing.T) {
	points := pointsByActivity(entries)
	require.Greater(t, sampleEntryQty, 0)
	for _, activity := range activities {
		t.Logf("%d: %s", points[activity.name], activity.name)
	}
}

func TestPointsByCategory(t *testing.T) {
	points := pointsByCategory(entries)
	require.Equal(t, len(categories), len(points))
	for _, category := range categories {
		t.Logf("%d: %s", points[category], category)
	}
}

func sampleEntries(qty int) []entry {
	entries := make([]entry, qty)
	for i := 0; i < qty; i++ {
		entries[i] = entry{
			time:     time.Now().Add(time.Duration(i) * time.Hour),
			activity: activities[i%len(activities)],
		}
	}
	return entries
}
