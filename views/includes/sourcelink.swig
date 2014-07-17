{# TODO: link to line number #}
{% set lineNumber = doc.meta.lineno %}
{% if lineNumber !== 1 %}
    {% set formattedLineNumber = ':' + lineNumber %}
{% else %}
    {% set formattedLineNumber = '' %}
{% endif %}
{{ link(doc.meta.shortpath, doc.meta.shortpath + formattedLineNumber) }}
