import wikipediaapi

def get_wikipedia_content(title):
  print(f"wiki title:{title}")
  print(f"Raw title: {repr(title)}")  # Debug print
  title = title.strip()  # Clean up leading/trailing spaces
  print(f"Sanitized title: {repr(title)}")
  wiki_wiki = wikipediaapi.Wikipedia(
      language='en',
      user_agent='my-bot'
  )

  # Get the page
  page = wiki_wiki.page(title)

  # Check if page exists
  if not page.exists():
      print("Page not found!")
  else:
      # Get the full text content
      text_content = page.text

      # Optionally, save it to a file
      with open("wikipedia_content.txt", "w", encoding="utf-8") as f:
          f.write(text_content)

      print("Text data saved to 'wikipedia_content.txt'")