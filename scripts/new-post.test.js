import { describe, it, expect } from 'vitest'
import { slugify, getDate, generateFrontMatter } from './new-post.js'

describe('new-post.js script', () => {
  describe('slugify', () => {
    it('should convert title to a clean slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Astro: The Web Framework')).toBe('astro-the-web-framework')
      expect(slugify('   Spaces and symbols! @#$%^   ')).toBe('spaces-and-symbols')
    })
  })

  describe('getDate', () => {
    it('should return a date in YYYY-MM-DD format', () => {
      const date = getDate()
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('generateFrontMatter', () => {
    it('should correctly format front-matter string without lang', () => {
      const answers = {
        title: 'Test Post',
        description: "It's a test",
        tags: ['test', 'unit'],
        category: 'Tech',
        draft: false,
        lang: ''
      }
      const output = generateFrontMatter(answers)
      
      expect(output).toContain('title: Test Post')
      expect(output).toContain("description: 'It''s a test'") 
      expect(output).toContain("tags: ['test', 'unit']")
      expect(output).toContain("category: 'Tech'")
      expect(output).toContain('draft: false')
      expect(output).not.toContain('lang:')
      expect(output).toContain(`published: ${getDate()}`)
    })

    it('should correctly format front-matter string with lang', () => {
      const answers = {
        title: 'Test Post',
        description: "It's a test",
        tags: ['test'],
        category: 'Tech',
        draft: false,
        lang: 'en'
      }
      const output = generateFrontMatter(answers)
      
      expect(output).toContain('lang: \'en\'')
    })
  })
})
