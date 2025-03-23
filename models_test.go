package main

import (
	"testing"

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
		t.Logf("%d: %s", points[activity.Name], activity.Name)
	}
}

func TestPointsByCategory(t *testing.T) {
	points := pointsByCategory(entries)
	require.Equal(t, len(categories), len(points))
	for _, category := range categories {
		t.Logf("%d: %s", points[category], category)
	}
}
