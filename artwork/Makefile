DEFAULT_DPI=90

all: logo.png logo-wide.png

clean:
	rm -rf logo.png logo-wide.png

logo.png: logo.svg
	inkscape --export-png=$@ \
		--export-dpi=10 \
		--export-background-opacity=0 \
		--without-gui $<

logo-wide.png: logo-wide.svg
	inkscape --export-png=$@ \
		--export-dpi=45 \
		--export-background-opacity=0 \
		--without-gui $<
